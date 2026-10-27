"use client";

import React, { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  constructor(props: CanvasErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): CanvasErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("[CanvasErrorBoundary caught WebGL/Three.js error]", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative flex aspect-[16/10] sm:aspect-[16/9] w-full flex-col items-center justify-center rounded-3xl border border-stone-300 bg-gradient-to-br from-[#EFE5D4] via-[#F4ECE0] to-[#E9DEC9] p-6 text-center shadow-inner">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-xs mb-3 text-[#7A4B29]">
            <Layers className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#2D1E12]">
            {this.props.fallbackTitle || "Tampilan 3D Dialihkan ke Mode 2D"}
          </h3>
          <p className="mt-1.5 max-w-sm text-xs text-stone-600 leading-relaxed">
            {this.props.fallbackDescription ||
              "Perangkat grafis Anda sedang menghemat daya atau WebGL tidak tersedia. Seluruh informasi dan data budaya tetap dapat diakses dengan optimal."}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={this.handleRetry}
            className="mt-4 rounded-full border-stone-400/80 bg-white/90 text-xs font-semibold text-stone-800 hover:bg-white cursor-pointer"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Coba Muat Ulang Model
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
