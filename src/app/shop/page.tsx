'use client';

import Link from 'next/link';
import Image from 'next/image';
import CheckoutButton from '@/components/CheckoutButton';

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
          {/* Starter Package */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Starter Package</h2>
              <p className="text-lg font-bold text-primary mb-2">$9.99</p>
              <p>Basic game access with standard features and regular updates.</p>
              <div className="justify-end card-actions">
                <CheckoutButton amount={9.99} productName="Starter Package" />
              </div>
            </div>
          </div>
          {/* Standard Package */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Standard Package</h2>
              <p className="text-lg font-bold text-primary mb-2">$19.99</p>
              <p>Enhanced gaming experience with premium features and priority support.</p>
              <div className="justify-end card-actions">
                <CheckoutButton amount={19.99} productName="Standard Package" />
              </div>
            </div>
          </div>
          {/* Premium Package */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Premium Package</h2>
              <p className="text-lg font-bold text-primary mb-2">$29.99</p>
              <p>Complete gaming package with all features, early access, and exclusive content.</p>
              <div className="justify-end card-actions">
                <CheckoutButton amount={29.99} productName="Premium Package" />
              </div>
            </div>
          </div>
          {/* Deluxe Package */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Deluxe Package</h2>
              <p className="text-lg font-bold text-primary mb-2">$49.99</p>
              <p>Ultimate gaming experience with lifetime updates and VIP support.</p>
              <div className="justify-end card-actions">
                <CheckoutButton amount={49.99} productName="Deluxe Package" />
              </div>
            </div>
          </div>
          {/* Enterprise Package */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Enterprise Package</h2>
              <p className="text-lg font-bold text-primary mb-2">$99.99</p>
              <p>Professional package with commercial licensing and dedicated support.</p>
              <div className="justify-end card-actions">
                <CheckoutButton amount={99.99} productName="Enterprise Package" />
              </div>
            </div>
          </div>
          {/* Ultimate Package */}
          <div className="card w-80 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Ultimate Package</h2>
              <p className="text-lg font-bold text-primary mb-2">$199.99</p>
              <p>The complete developer package with source code access and full licensing rights.</p>
              <div className="justify-end card-actions">
                <CheckoutButton amount={199.99} productName="Ultimate Package" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
