'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Shop() {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      {/* Logo in a flex row at the top */}
      <div className="py-6 px-6">
        <Link href="/">
          <Image
            src="/favicon.ico"
            alt="Home"
            width={48}
            height={48}
            className="rounded-full hover:scale-110 transition"
            title="Go to Homepage"
          />
        </Link>
      </div>
      <main className="min-h-screen flex flex-col items-center py-12">
        <h1 className="text-4xl font-bold mb-10 text-primary">Shop</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Xsmall Card */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Xsmall Card</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
          {/* Small Card */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Small Card</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
          {/* Medium Card */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Medium Card</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
          {/* Large Card */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Large Card</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
          {/* Xlarge Card */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Xlarge Card</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
          {/* Xlarge Card */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Xlarge Card</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
          {/* Large Card */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Large Card</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
          {/* Xlarge Card */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Xlarge Card</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
          {/* Xlarge Card */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Xlarge Card</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
              <div className="justify-end card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}