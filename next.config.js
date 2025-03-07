module.exports = {
    webpack: (config, { isServer }) => {
        // Use raw-loader for .md files
        config.module.rules.push({
            test: /\.md$/,
            use: 'raw-loader'
        });

        // // Exclude .d.ts files
        config.module.rules.push({
            test: /\.d\.ts$/,
            use: 'ignore-loader'
        });
        config.resolve.alias = {
            ...config.resolve.alias,
            // Exclude Linux-specific binaries
            "@remotion/compositor-linux-x64-musl": false,
            "@remotion/compositor-linux-x64-gnu": false,
            "@remotion/compositor-linux-arm64-musl": false,
            "@remotion/compositor-linux-arm64-gnu": false,
            // Exclude internal Remotion modules
            "@remotion/eslint-config-internal": false,
        };
        // Ignore fs module in client-side code
        if (!isServer) {
            config.resolve.fallback = {
                child_process: false,
                fs: false,
                net: false,
                dns: false,
                tls: false,
            };
            config.resolve.alias = {
                ...config.resolve.alias,
                "node:assert": "assert",
            };
            // config.resolve.fallback = {
            //     ...config.resolve.fallback,
            //     assert: require.resolve("assert/"),
            // };
        }
        config.output.chunkLoadTimeout = 30000; // 30 seconds
        return config;
    }
};