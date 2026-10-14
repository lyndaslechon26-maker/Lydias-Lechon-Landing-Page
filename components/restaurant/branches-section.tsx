"use client"

import { MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeUp, ScaleFade } from "@/components/ui/scroll-animations"
import Link from "next/link"
import Image from "next/image"

export function BranchesSection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* LEFT SIDE - Image */}
          <FadeUp>
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/LydiasBG2.png"
                alt="Lydia's Lechon Branches"
                fill
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              
              {/* Badge on image */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-amber-600/90 backdrop-blur-sm rounded-xl p-4 border border-amber-500/50">
                  <div className="flex items-center gap-3">
                    <MapPin className="size-8 text-white" />
                    <div>
                      <p className="text-white font-bold text-xl">9 Branches</p>
                      <p className="text-amber-100 text-sm">Serving Metro Manila & Luzon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* RIGHT SIDE - Text Content */}
          <FadeUp delay={200}>
            <div>
              {/* Label */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/10 border border-amber-600/20 mb-6">
                <MapPin className="size-4 text-amber-500" />
                <span className="text-amber-500 text-sm font-semibold uppercase tracking-wider">
                  Our Locations
                </span>
              </div>
              
              {/* Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Find Us
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Near You
                </span>
              </h2>
              
              {/* Description */}
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                With <span className="text-amber-400 font-semibold">9 branches</span> across Metro Manila and Luzon, 
                we're committed to bringing authentic Filipino lechon closer to you. 
                Each branch offers the same legendary taste and warm hospitality that Lydia's 
                Lechon has been known for since 1965.
              </p>

              {/* Quick Info List */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="size-2 rounded-full bg-amber-500" />
                  <span>Metro Manila: Baclaran, Timog, Roces, Fairview, Pasig</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="size-2 rounded-full bg-amber-500" />
                  <span>Rizal: Marcos Highway</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="size-2 rounded-full bg-amber-500" />
                  <span>Cavite: General Trias</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="size-2 rounded-full bg-amber-500" />
                  <span>Laguna: Calamba, Los Baños</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/events/branches">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-amber-600/30 transition-all"
                >
                  See All Branches
                  <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
