"use client";

import * as React from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";

export type HashLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> &
  NextLinkProps & {
    href: string;
  };

/**
 * WaraNusa — HashLink / Smart Route Link Adapter
 * Secara cerdas menormalkan tautan:
 * - Mengubah URL legacy `#/path` menjadi rute bersih App Router `/path`.
 * - Menggunakan client-side navigation Next.js (`next/link`) dengan prefetching instan.
 * - Mendukung anchor halaman (`#section`) atau link eksternal (`http...`) secara mulus.
 */
export const HashLink = React.forwardRef<HTMLAnchorElement, HashLinkProps>(
  function HashLink({ href, onClick, ...props }, ref) {
    let cleanHref = href;
    if (cleanHref.startsWith("#/")) {
      cleanHref = cleanHref.slice(1); // "#/katalog" -> "/katalog"
    } else if (cleanHref === "#") {
      cleanHref = "/";
    }

    const isExternal = cleanHref.startsWith("http://") || cleanHref.startsWith("https://") || cleanHref.startsWith("mailto:");
    const isAnchorOnly = cleanHref.startsWith("#") && !cleanHref.startsWith("#/");

    if (isExternal || isAnchorOnly) {
      return <a ref={ref} href={cleanHref} onClick={onClick} {...props} />;
    }

    return <NextLink ref={ref} href={cleanHref} onClick={onClick} {...props} />;
  }
);
