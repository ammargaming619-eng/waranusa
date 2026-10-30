"use client";

import type { SynthPreset } from "@/data/instruments-data";

type SampleStatus = "untested" | "loading" | "ready" | "missing";

interface ActiveContinuousVoice {
  preset: "bow" | "blow";
  osc1: OscillatorNode;
  osc2: OscillatorNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
  noiseSource: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  voiceGain: GainNode;
  startedAt: number;
}

class HybridSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbSend: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private volume = 0.78;

  private sampleCache = new Map<string, AudioBuffer>();
  private sampleStatus = new Map<string, SampleStatus>();

  private activeVoice: ActiveContinuousVoice | null = null;

  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private micAnalyser: AnalyserNode | null = null;
  private micRafId: number | null = null;
  private micActive = false;

  // Throttling pengaman agar satu input fisik tidak dapat memicu 2 kali suara beruntun
  private lastTriggerTime = 0;
  private lastTriggerNoteKey = "";

  public ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      // Buat impuls ruang akustik hangat (Warm Acoustic Hall Reverb)
      this.convolver = this.ctx.createConvolver();
      this.convolver.buffer = this.createWarmReverbImpulse(this.ctx, 1.85, 2.8);

      this.reverbSend = this.ctx.createGain();
      this.reverbSend.gain.value = 0.24;

      this.masterGain.connect(this.ctx.destination);
      this.reverbSend.connect(this.convolver);
      this.convolver.connect(this.masterGain);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public setVolume(nextVolume: number) {
    this.volume = Math.max(0, Math.min(1, nextVolume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.02);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  private createWarmReverbImpulse(
    ctx: AudioContext,
    durationSec: number,
    decayRate: number
  ): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * durationSec);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      let prev = 0;
      for (let i = 0; i < length; i++) {
        const t = i / length;
        const env = Math.pow(1 - t, decayRate);
        const white = Math.random() * 2 - 1;
        // Redaman frekuensi tinggi agar ruang gema terasa hangat seperti kayu pendapa
        prev = prev * 0.72 + white * 0.28;
        data[i] = prev * env * 0.45;
      }
    }
    return impulse;
  }

  /**
   * Cek apakah file sampel `/audio/instruments/[id].mp3` tersedia.
   * Jika 404, tandai sebagai "missing" agar tidak melakukan request berulang.
   */
  public async preloadInstrumentSample(instrumentId: string): Promise<boolean> {
    const status = this.sampleStatus.get(instrumentId) ?? "untested";
    if (status === "ready") return true;
    if (status === "missing" || status === "loading") return false;

    this.sampleStatus.set(instrumentId, "loading");
    try {
      const res = await fetch(`/audio/instruments/${encodeURIComponent(instrumentId)}.mp3`, {
        method: "GET",
      });
      if (!res.ok) {
        this.sampleStatus.set(instrumentId, "missing");
        return false;
      }
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("audio") && !contentType.includes("octet-stream")) {
        this.sampleStatus.set(instrumentId, "missing");
        return false;
      }
      const arrayBuf = await res.arrayBuffer();
      const ctx = this.ensureContext();
      if (!ctx) {
        this.sampleStatus.set(instrumentId, "missing");
        return false;
      }
      const decoded = await ctx.decodeAudioData(arrayBuf);
      this.sampleCache.set(instrumentId, decoded);
      this.sampleStatus.set(instrumentId, "ready");
      return true;
    } catch {
      this.sampleStatus.set(instrumentId, "missing");
      return false;
    }
  }

  /**
   * Mainkan nada instrumen menggunakan sistem Hybrid Audio:
   * 1. Jika sampel MP3 tersedia di cache, putar sampel dengan penyesuaian pitch.
   * 2. Jika MP3 belum tersedia (404), jalankan Procedural Web Audio Synthesizer sesuai preset.
   */
  public triggerNote(options: {
    instrumentId: string;
    synthPreset: SynthPreset;
    freq: number;
    baseFreq?: number;
    velocity?: number;
  }) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || !this.reverbSend) return;

    const { instrumentId, synthPreset, freq, baseFreq = 261.63, velocity = 0.88 } = options;

    // Pengaman debouncing: abaikan jika nada yang sama terpicu ulang dalam jendela 80ms
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const noteKey = `${instrumentId}-${Math.round(freq)}`;
    if (noteKey === this.lastTriggerNoteKey && now - this.lastTriggerTime < 80) {
      return;
    }
    this.lastTriggerTime = now;
    this.lastTriggerNoteKey = noteKey;

    // Putar dari cache sampel jika tersedia
    if (this.sampleStatus.has(instrumentId) && this.sampleStatus.get(instrumentId) === "ready") {
      const cachedBuffer = this.sampleCache.get(instrumentId);
      if (cachedBuffer) {
        const src = ctx.createBufferSource();
        src.buffer = cachedBuffer;
        src.playbackRate.value = Math.max(0.4, Math.min(2.5, freq / baseFreq));
        const gain = ctx.createGain();
        gain.gain.value = Math.min(1, velocity);
        src.connect(gain);
        gain.connect(this.masterGain);
        gain.connect(this.reverbSend);
        src.start();
        return;
      }
    }

    // Fallback Prosedural Web Audio Synthesizer
    switch (synthPreset) {
      case "strike_drum":
        this.synthStrikeDrum(ctx, freq, velocity);
        break;
      case "strike_metal_wood":
        this.synthStrikeMetalWood(ctx, freq, velocity);
        break;
      case "pluck":
        this.synthKarplusStrongPluck(ctx, freq, velocity);
        break;
      case "bow":
        this.synthBowPulse(ctx, freq, velocity);
        break;
      case "shake":
        this.synthBambooShake(ctx, freq, velocity);
        break;
      case "blow":
        this.synthBlowPulse(ctx, freq, velocity);
        break;
    }
  }

  // ============================================================================
  // 1. STRIKE DRUM (Gendang / Tifa / Dol / Rapai / Kendang)
  // Membrane drum synthesis dengan frekuensi low-mid yang empuk & tepukan kulit
  // ============================================================================
  private synthStrikeDrum(ctx: AudioContext, freq: number, velocity: number) {
    if (!this.masterGain || !this.reverbSend) return;
    const now = ctx.currentTime;
    const drumFreq = Math.max(65, Math.min(280, freq));

    // Osilator membran utama (pitch drop cepat khas kulit gendang/tifa)
    const bodyOsc = ctx.createOscillator();
    bodyOsc.type = "sine";
    bodyOsc.frequency.setValueAtTime(drumFreq * 1.72, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(drumFreq, now + 0.055);
    bodyOsc.frequency.exponentialRampToValueAtTime(drumFreq * 0.78, now + 0.42);

    // Harmonik tabung kayu resonator (mode membran kedua 1.58x)
    const woodOsc = ctx.createOscillator();
    woodOsc.type = "triangle";
    woodOsc.frequency.setValueAtTime(drumFreq * 2.15, now);
    woodOsc.frequency.exponentialRampToValueAtTime(drumFreq * 1.48, now + 0.08);

    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(0.0001, now);
    bodyGain.gain.linearRampToValueAtTime(0.68 * velocity, now + 0.004);
    bodyGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.46);

    const woodGain = ctx.createGain();
    woodGain.gain.setValueAtTime(0.0001, now);
    woodGain.gain.linearRampToValueAtTime(0.24 * velocity, now + 0.003);
    woodGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.16);

    // Transien tepukan telapak tangan pada selaput kulit (bandpass noise burst)
    const slapLen = Math.floor(ctx.sampleRate * 0.045);
    const slapBuf = ctx.createBuffer(1, slapLen, ctx.sampleRate);
    const slapData = slapBuf.getChannelData(0);
    for (let i = 0; i < slapLen; i++) {
      slapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (slapLen * 0.28));
    }
    const slapSrc = ctx.createBufferSource();
    slapSrc.buffer = slapBuf;

    const slapFilter = ctx.createBiquadFilter();
    slapFilter.type = "bandpass";
    slapFilter.frequency.value = drumFreq * 3.4;
    slapFilter.Q.value = 1.8;

    const slapGain = ctx.createGain();
    slapGain.gain.value = 0.36 * velocity;

    bodyOsc.connect(bodyGain);
    woodOsc.connect(woodGain);
    slapSrc.connect(slapFilter);
    slapFilter.connect(slapGain);

    bodyGain.connect(this.masterGain);
    bodyGain.connect(this.reverbSend);
    woodGain.connect(this.masterGain);
    slapGain.connect(this.masterGain);

    bodyOsc.start(now);
    woodOsc.start(now);
    slapSrc.start(now);

    bodyOsc.stop(now + 0.48);
    woodOsc.stop(now + 0.18);
  }

  // ============================================================================
  // 2. STRIKE METAL / WOOD (Saron / Bonang / Kolintang / Talempong / Rindik)
  // FM & Inharmonic Bell/Marimba resonance dengan tangga nada Pentatonis
  // ============================================================================
  private synthStrikeMetalWood(ctx: AudioContext, freq: number, velocity: number) {
    if (!this.masterGain || !this.reverbSend) return;
    const now = ctx.currentTime;

    // Fundamental bilah perunggu / kayu
    const fundOsc = ctx.createOscillator();
    fundOsc.type = "sine";
    fundOsc.frequency.setValueAtTime(freq, now);

    // Modulator FM untuk karakter denting gangsa / bilah resonansi
    const modOsc = ctx.createOscillator();
    modOsc.type = "sine";
    modOsc.frequency.setValueAtTime(freq * 2.756, now);

    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(freq * 1.35 * velocity, now);
    modGain.gain.exponentialRampToValueAtTime(0.5, now + 0.28);

    // Overtone inharmonik ke-2 khas bilah metalofon/xilofon
    const overtoneOsc = ctx.createOscillator();
    overtoneOsc.type = "triangle";
    overtoneOsc.frequency.setValueAtTime(freq * 5.404, now);

    const fundGain = ctx.createGain();
    fundGain.gain.setValueAtTime(0.0001, now);
    fundGain.gain.linearRampToValueAtTime(0.42 * velocity, now + 0.005);
    fundGain.gain.exponentialRampToValueAtTime(0.0008, now + 2.35);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.0001, now);
    overtoneGain.gain.linearRampToValueAtTime(0.11 * velocity, now + 0.003);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.38);

    // Ketukan panggul/mallet kayu pada bilah
    const clickOsc = ctx.createOscillator();
    clickOsc.type = "triangle";
    clickOsc.frequency.setValueAtTime(freq * 3.8, now);
    clickOsc.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 0.025);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.18 * velocity, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.028);

    modOsc.connect(modGain);
    modGain.connect(fundOsc.frequency);

    fundOsc.connect(fundGain);
    overtoneOsc.connect(overtoneGain);
    clickOsc.connect(clickGain);

    fundGain.connect(this.masterGain);
    fundGain.connect(this.reverbSend);
    overtoneGain.connect(this.masterGain);
    clickGain.connect(this.masterGain);

    fundOsc.start(now);
    modOsc.start(now);
    overtoneOsc.start(now);
    clickOsc.start(now);

    fundOsc.stop(now + 2.4);
    modOsc.stop(now + 0.35);
    overtoneOsc.stop(now + 0.42);
    clickOsc.stop(now + 0.035);
  }

  // ============================================================================
  // 3. PLUCK (Sasando / Sape' / Gambus / Dambus / Kecapi / Hasapi)
  // Karplus-Strong string pluck synthesis + body resonator + reverb akustik hangat
  // ============================================================================
  private synthKarplusStrongPluck(ctx: AudioContext, freq: number, velocity: number) {
    if (!this.masterGain || !this.reverbSend) return;
    const now = ctx.currentTime;
    const sampleRate = ctx.sampleRate;
    const durationSec = 2.6;
    const totalSamples = Math.floor(sampleRate * durationSec);
    const period = Math.max(8, Math.round(sampleRate / Math.max(70, Math.min(1400, freq))));

    const buffer = ctx.createBuffer(1, totalSamples, sampleRate);
    const data = buffer.getChannelData(0);

    // Eksitasi awal: burst petikan kuku/jari yang dihaluskan (pick position filtering)
    const ring = new Float32Array(period);
    let smooth = 0;
    for (let i = 0; i < period; i++) {
      const raw = Math.random() * 2 - 1;
      smooth = smooth * 0.58 + raw * 0.42;
      ring[i] = smooth * velocity;
    }

    // Loop Karplus-Strong dengan redaman dawai hangat
    const damping = 0.9942;
    let idx = 0;
    for (let i = 0; i < totalSamples; i++) {
      const nextIdx = (idx + 1) % period;
      const current = ring[idx];
      const avg = 0.5 * (current + ring[nextIdx]) * damping;
      data[i] = current * 0.72;
      ring[idx] = avg;
      idx = nextIdx;
    }

    const pluckSrc = ctx.createBufferSource();
    pluckSrc.buffer = buffer;

    // Resonator bodi kayu / daun lontar haik
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = "peaking";
    bodyFilter.frequency.value = Math.min(680, freq * 1.5);
    bodyFilter.Q.value = 1.6;
    bodyFilter.gain.value = 4.5;

    const outGain = ctx.createGain();
    outGain.gain.setValueAtTime(0.65, now);
    outGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec - 0.05);

    pluckSrc.connect(bodyFilter);
    bodyFilter.connect(outGain);
    outGain.connect(this.masterGain);
    outGain.connect(this.reverbSend);

    pluckSrc.start(now);
  }

  // ============================================================================
  // 4. BOW (Tehyan / Keso-Keso / Arbab / Ladolado)
  // Sustained bowed string (filtered sawtooth dengan vibrato halus)
  // ============================================================================
  private synthBowPulse(ctx: AudioContext, freq: number, velocity: number) {
    if (!this.masterGain || !this.reverbSend) return;
    const now = ctx.currentTime;

    const sawOsc = ctx.createOscillator();
    sawOsc.type = "sawtooth";
    sawOsc.frequency.setValueAtTime(freq, now);

    // LFO Vibrato jari khas gesekan rebab/keso-keso/tehyan
    const vibratoOsc = ctx.createOscillator();
    vibratoOsc.type = "sine";
    vibratoOsc.frequency.value = 5.4;

    const vibratoGain = ctx.createGain();
    vibratoGain.gain.value = freq * 0.014;
    vibratoOsc.connect(vibratoGain);
    vibratoGain.connect(sawOsc.frequency);

    // Formant tabung tempurung kelapa / kayu
    const formant1 = ctx.createBiquadFilter();
    formant1.type = "bandpass";
    formant1.frequency.value = Math.min(1800, freq * 2.2);
    formant1.Q.value = 2.4;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = Math.min(2600, freq * 4.5);

    const envGain = ctx.createGain();
    envGain.gain.setValueAtTime(0.0001, now);
    envGain.gain.linearRampToValueAtTime(0.38 * velocity, now + 0.16);
    envGain.gain.setValueAtTime(0.34 * velocity, now + 0.52);
    envGain.gain.exponentialRampToValueAtTime(0.0008, now + 1.15);

    sawOsc.connect(formant1);
    formant1.connect(lowpass);
    lowpass.connect(envGain);

    envGain.connect(this.masterGain);
    envGain.connect(this.reverbSend);

    sawOsc.start(now);
    vibratoOsc.start(now);
    sawOsc.stop(now + 1.18);
    vibratoOsc.stop(now + 1.18);
  }

  // ============================================================================
  // 5. SHAKE (Angklung / Ceng-Ceng / Ganda / Pikon)
  // Bamboo tube rattler (dual-pitched resonant bandpass + tremolo cepat)
  // ============================================================================
  private synthBambooShake(ctx: AudioContext, freq: number, velocity: number) {
    if (!this.masterGain || !this.reverbSend) return;
    const now = ctx.currentTime;
    const duration = 0.78;

    // Dua tabung bambu berselisih 1 oktaf murni (f dan 2f)
    const tubeLow = ctx.createOscillator();
    tubeLow.type = "triangle";
    tubeLow.frequency.setValueAtTime(freq, now);

    const tubeHigh = ctx.createOscillator();
    tubeHigh.type = "sine";
    tubeHigh.frequency.setValueAtTime(freq * 2, now);

    // Tremolo goyangan cepat (14.5 Hz) khas angklung bambu
    const tremoloOsc = ctx.createOscillator();
    tremoloOsc.type = "sine";
    tremoloOsc.frequency.value = 14.5;

    const tremoloDepth = ctx.createGain();
    tremoloDepth.gain.value = 0.22 * velocity;

    const rattleGain = ctx.createGain();
    rattleGain.gain.setValueAtTime(0.26 * velocity, now);
    rattleGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    tremoloOsc.connect(tremoloDepth);
    tremoloDepth.connect(rattleGain.gain);

    // Derak benturan pangkal tabung bambu (woody clack bursts)
    const noiseLen = Math.floor(ctx.sampleRate * duration);
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      const t = i / ctx.sampleRate;
      const burst = Math.pow(Math.max(0, Math.sin(2 * Math.PI * 14.5 * t)), 6);
      noiseData[i] = (Math.random() * 2 - 1) * burst * Math.exp(-t * 2.2) * 0.55;
    }
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;

    const bambooFilter = ctx.createBiquadFilter();
    bambooFilter.type = "bandpass";
    bambooFilter.frequency.value = freq * 2.0;
    bambooFilter.Q.value = 4.5;

    tubeLow.connect(rattleGain);
    tubeHigh.connect(rattleGain);
    noiseSrc.connect(bambooFilter);
    bambooFilter.connect(rattleGain);

    rattleGain.connect(this.masterGain);
    rattleGain.connect(this.reverbSend);

    tubeLow.start(now);
    tubeHigh.start(now);
    tremoloOsc.start(now);
    noiseSrc.start(now);

    tubeLow.stop(now + duration + 0.04);
    tubeHigh.stop(now + duration + 0.04);
    tremoloOsc.stop(now + duration + 0.04);
  }

  // ============================================================================
  // 6. BLOW (Tahuri / Fu / Triton / Serune Kalee / Saluang / Lalove)
  // Conch shell horn / aerophone synthesis (deep brassy/bamboo resonant drone)
  // ============================================================================
  private synthBlowPulse(ctx: AudioContext, freq: number, velocity: number) {
    if (!this.masterGain || !this.reverbSend) return;
    const now = ctx.currentTime;
    const duration = 1.25;

    const hornOsc1 = ctx.createOscillator();
    hornOsc1.type = "sawtooth";
    hornOsc1.frequency.setValueAtTime(freq * 0.985, now);
    hornOsc1.frequency.exponentialRampToValueAtTime(freq, now + 0.09);

    const hornOsc2 = ctx.createOscillator();
    hornOsc2.type = "triangle";
    hornOsc2.frequency.setValueAtTime(freq * 1.003, now);

    // Vibrato napas alami
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 4.8;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = freq * 0.008;
    lfo.connect(lfoGain);
    lfoGain.connect(hornOsc1.frequency);

    // Derau hembusan napas (breath turbulence)
    const breathLen = Math.floor(ctx.sampleRate * duration);
    const breathBuf = ctx.createBuffer(1, breathLen, ctx.sampleRate);
    const breathData = breathBuf.getChannelData(0);
    for (let i = 0; i < breathLen; i++) {
      breathData[i] = (Math.random() * 2 - 1) * 0.18;
    }
    const breathSrc = ctx.createBufferSource();
    breathSrc.buffer = breathBuf;

    const hornFilter = ctx.createBiquadFilter();
    hornFilter.type = "lowpass";
    hornFilter.frequency.setValueAtTime(freq * 1.8, now);
    hornFilter.frequency.linearRampToValueAtTime(freq * 3.6, now + 0.22);
    hornFilter.Q.value = 2.8;

    const envGain = ctx.createGain();
    envGain.gain.setValueAtTime(0.0001, now);
    envGain.gain.linearRampToValueAtTime(0.38 * velocity, now + 0.14);
    envGain.gain.setValueAtTime(0.34 * velocity, now + 0.72);
    envGain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    hornOsc1.connect(hornFilter);
    hornOsc2.connect(hornFilter);
    breathSrc.connect(hornFilter);
    hornFilter.connect(envGain);

    envGain.connect(this.masterGain);
    envGain.connect(this.reverbSend);

    hornOsc1.start(now);
    hornOsc2.start(now);
    lfo.start(now);
    breathSrc.start(now);

    hornOsc1.stop(now + duration + 0.04);
    hornOsc2.stop(now + duration + 0.04);
    lfo.stop(now + duration + 0.04);
  }

  // ============================================================================
  // SUARA KONTINYU (DRAG & HOLD UNTUK BOW / HOLD & MIC UNTUK BLOW)
  // ============================================================================
  public startContinuousVoice(preset: "bow" | "blow", freq: number, intensity = 0.75) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || !this.reverbSend) return;

    if (this.activeVoice) {
      this.updateContinuousVoice(freq, intensity);
      return;
    }

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc2.type = preset === "bow" ? "sawtooth" : "triangle";
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * (preset === "bow" ? 1.004 : 0.998), now);

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = preset === "bow" ? 5.5 : 4.6;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = freq * (preset === "bow" ? 0.013 : 0.008);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    // Loop derau gesekan damar (rosin) atau derau tiupan napas
    const loopLen = ctx.sampleRate * 2;
    const noiseBuf = ctx.createBuffer(1, loopLen, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < loopLen; i++) {
      data[i] = (Math.random() * 2 - 1) * (preset === "bow" ? 0.08 : 0.16);
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuf;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = preset === "bow" ? "bandpass" : "lowpass";
    filter.frequency.setValueAtTime(
      preset === "bow" ? Math.min(2100, freq * 2.6) : Math.min(2400, freq * 3.2),
      now
    );
    filter.Q.value = preset === "bow" ? 2.2 : 2.8;

    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0.0001, now);
    voiceGain.gain.linearRampToValueAtTime(0.36 * Math.max(0.15, intensity), now + 0.08);

    osc1.connect(filter);
    osc2.connect(filter);
    noiseSource.connect(filter);
    filter.connect(voiceGain);

    voiceGain.connect(this.masterGain);
    voiceGain.connect(this.reverbSend);

    osc1.start(now);
    osc2.start(now);
    lfo.start(now);
    noiseSource.start(now);

    this.activeVoice = {
      preset,
      osc1,
      osc2,
      lfo,
      lfoGain,
      noiseSource,
      filter,
      voiceGain,
      startedAt: now,
    };
  }

  public updateContinuousVoice(freq: number, intensity = 0.75) {
    if (!this.activeVoice || !this.ctx) return;
    const now = this.ctx.currentTime;
    const clampedIntensity = Math.max(0.05, Math.min(1, intensity));

    this.activeVoice.osc1.frequency.setTargetAtTime(freq, now, 0.03);
    this.activeVoice.osc2.frequency.setTargetAtTime(
      freq * (this.activeVoice.preset === "bow" ? 1.004 : 0.998),
      now,
      0.03
    );
    this.activeVoice.lfoGain.gain.setTargetAtTime(
      freq * (this.activeVoice.preset === "bow" ? 0.013 : 0.008),
      now,
      0.03
    );
    this.activeVoice.filter.frequency.setTargetAtTime(
      this.activeVoice.preset === "bow"
        ? Math.min(2400, freq * (1.8 + clampedIntensity * 1.4))
        : Math.min(2800, freq * (1.6 + clampedIntensity * 2.2)),
      now,
      0.04
    );
    this.activeVoice.voiceGain.gain.setTargetAtTime(0.38 * clampedIntensity, now, 0.035);
  }

  public stopContinuousVoice() {
    if (!this.activeVoice || !this.ctx) return;
    const voice = this.activeVoice;
    this.activeVoice = null;

    const now = this.ctx.currentTime;
    try {
      voice.voiceGain.gain.cancelScheduledValues(now);
      voice.voiceGain.gain.setTargetAtTime(0.0001, now, 0.045);
      setTimeout(() => {
        try {
          voice.osc1.stop();
          voice.osc2.stop();
          voice.lfo.stop();
          voice.noiseSource.stop();
          voice.voiceGain.disconnect();
        } catch {
          // Abaikan bila sudah berhenti
        }
      }, 180);
    } catch {
      // Abaikan bila context ditutup
    }
  }

  // ============================================================================
  // PENDETEKSI TIUPAN MIKROFON (AnalyserNode) UNTUK ALAT MUSIK TIUP (BLOW)
  // ============================================================================
  public async startMicBlowDetector(
    onBlowLevel: (level: number, isBlowing: boolean) => void
  ): Promise<boolean> {
    this.stopMicBlowDetector();
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        return false;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      const ctx = this.ensureContext();
      if (!ctx) {
        stream.getTracks().forEach((t) => t.stop());
        return false;
      }

      this.micStream = stream;
      this.micSource = ctx.createMediaStreamSource(stream);
      this.micAnalyser = ctx.createAnalyser();
      this.micAnalyser.fftSize = 256;
      this.micAnalyser.smoothingTimeConstant = 0.65;
      this.micSource.connect(this.micAnalyser);
      this.micActive = true;

      const freqBins = new Uint8Array(this.micAnalyser.frequencyBinCount);

      const loop = () => {
        if (!this.micActive || !this.micAnalyser) return;
        this.micAnalyser.getByteFrequencyData(freqBins);

        // Hitung energi frekuensi rendah-menengah (karakteristik turbulensi tiupan napas ke mikrofon)
        let sum = 0;
        const binCount = Math.min(28, freqBins.length);
        for (let i = 1; i < binCount; i++) {
          sum += freqBins[i];
        }
        const avg = sum / Math.max(1, binCount - 1);
        const normalized = Math.min(1, Math.max(0, (avg - 24) / 115));
        const isBlowing = normalized > 0.14;

        onBlowLevel(normalized, isBlowing);
        this.micRafId = requestAnimationFrame(loop);
      };

      this.micRafId = requestAnimationFrame(loop);
      return true;
    } catch {
      this.stopMicBlowDetector();
      return false;
    }
  }

  public stopMicBlowDetector() {
    this.micActive = false;
    if (this.micRafId !== null) {
      cancelAnimationFrame(this.micRafId);
      this.micRafId = null;
    }
    if (this.micSource) {
      try {
        this.micSource.disconnect();
      } catch {
        // Abaikan
      }
      this.micSource = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }
    this.micAnalyser = null;
  }
}

export const soundEngine = new HybridSoundEngine();
