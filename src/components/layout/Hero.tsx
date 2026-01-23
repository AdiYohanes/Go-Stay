import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
      <img
        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2832&ixlib=rb-4.0.3"
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-20"
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Find your next stay
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Discover homes, cabins, and unique properties around the world. Book your perfect getaway today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="#properties">Explore Properties</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-white border-white hover:bg-white/10 hover:text-white bg-transparent">
              <Link href="/search">Advanced Search</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
