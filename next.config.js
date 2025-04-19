// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     webpack: (config, { isServer }) => {
//       if (!isServer) {
//         config.resolve.fallback = {
//           fs: false,
//           path: false,
//           os: false,
//           async_hooks: false,
//           crypto: false,
//           stream: false,
//           buffer: false,
//           util: false,
//           assert: false,
//         };
        
//         config.externals = [...(config.externals || []), {
//           '@mapbox/node-pre-gyp': 'commonjs @mapbox/node-pre-gyp'
//         }];
  
//         config.module.rules.push({
//           test: /node-pre-gyp[/\\]lib[/\\]util[/\\]nw-pre-gyp/,
//           use: 'null-loader'
//         });
  
//         // Add rule for handling webpack hot updates
      
//         config.module.rules.push({
//           test: /\.hot-update\.json$/,
//           use: 'ignore-loader'
//         });
//       }
//       return config;
//     },
//     // Add other Next.js config options from your existing config
//     eslint: {
//       ignoreDuringBuilds: true,
//     },
//     typescript: {
//       ignoreBuildErrors: true,
//     },
//     experimental: {
//       webpackBuildWorker: true,
//     }
//   };
  
//   export default nextConfig;

module.exports = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Don't resolve these modules on the client
        config.resolve.fallback = {
            ...config.resolve.fallback,
          fs: false,
          path: false,
          os: false,
          async_hooks: false,
          // Add other Node.js built-in modules that need to be polyfilled
        };
        
        // Add node-pre-gyp to the list of ignored modules and handle its assets
        config.externals = [...(config.externals || []), {
          '@mapbox/node-pre-gyp': 'commonjs @mapbox/node-pre-gyp'
        }];

        webpack: (config) => {
            config.externals = [...config.externals, 'bcryptjs'];
             return config;
           },
        // Add rule to handle node-pre-gyp assets
        config.module.rules.push({
          test: /node-pre-gyp[/\\]lib[/\\]util[/\\]nw-pre-gyp/,
          use: 'null-loader'
        });
      }
      return config;
    },
  };
