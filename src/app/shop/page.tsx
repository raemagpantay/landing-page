'use client';

import Link from 'next/link';
import Image from 'next/image';
import CheckoutButton from '@/components/CheckoutButton';

export default function Shop() {
  const products = [
    {
      name: 'Starter Package',
      price: 9.99,
      description: 'Basic game access with standard features and regular updates.',
      features: ['Basic Game Access', 'Standard Features', 'Regular Updates', 'Community Support'],
      badge: null,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Standard Package',
      price: 19.99,
      description: 'Enhanced gaming experience with premium features and priority support.',
      features: ['All Starter Features', 'Premium Features', 'Priority Support', 'Exclusive Items'],
      badge: 'Popular',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Premium Package',
      price: 29.99,
      description: 'Complete gaming package with all features, early access, and exclusive content.',
      features: ['All Standard Features', 'Early Access', 'Exclusive Content', 'VIP Badge'],
      badge: 'Best Value',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      name: 'Deluxe Package',
      price: 49.99,
      description: 'Ultimate gaming experience with lifetime updates and VIP support.',
      features: ['All Premium Features', 'Lifetime Updates', 'VIP Support', 'Custom Avatar'],
      badge: null,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Enterprise Package',
      price: 99.99,
      description: 'Professional package with commercial licensing and dedicated support.',
      features: ['All Deluxe Features', 'Commercial License', 'Dedicated Support', 'API Access'],
      badge: 'Pro',
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      name: 'Ultimate Package',
      price: 199.99,
      description: 'The complete developer package with source code access and full licensing rights.',
      features: ['All Enterprise Features', 'Source Code Access', 'Full Licensing', 'Priority Development'],
      badge: 'Elite',
      gradient: 'from-yellow-500 to-amber-500',
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/TrashArt-bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-blue-900/60"></div>

      {/* Logo in a flex row at the top */}
      <div className="py-6 px-6 relative z-10">
        <Link href="/">
          <Image
            src="/images/favicontrashbin.ico"
            alt="Home"
            width={56}
            height={56}
            className="rounded-xl hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
            title="Go to Homepage"
          />
        </Link>
      </div>

      <main className="min-h-screen flex flex-col items-center py-12 px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            Game Packages
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Choose the perfect package for your gaming journey. All packages include secure payment processing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
          {products.map((product, index) => (
            <div
              key={index}
              className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:border-white/40 transition-all duration-300 hover:scale-[1.02] group"
            >
              {/* Badge */}
              {product.badge && (
                <div className={`absolute top-4 right-4 bg-gradient-to-r ${product.gradient} text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg z-10`}>
                  {product.badge}
                </div>
              )}

              {/* Gradient Header */}
              <div className={`h-32 bg-gradient-to-br ${product.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Card Content */}
              <div className="p-6 relative">
                <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
                
                <div className="flex items-baseline mb-4">
                  <span className={`text-4xl font-bold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                    ${product.price}
                  </span>
                  <span className="text-gray-400 ml-2">USD</span>
                </div>

                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Features List */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Features:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-300 text-sm">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Checkout Button */}
                <div className="mt-6">
                  <CheckoutButton amount={product.price} productName={product.name} />
                </div>
              </div>

              {/* Hover Effect Glow */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${product.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`}></div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 max-w-4xl w-full">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Why Choose Our Packages?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Secure Payments</h3>
                <p className="text-gray-400 text-sm">Powered by Stripe for safe transactions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Instant Access</h3>
                <p className="text-gray-400 text-sm">Start playing immediately after purchase</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-400 text-sm">Always here to help you succeed</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
