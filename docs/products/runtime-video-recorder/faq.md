# Frequently Asked Questions

## API Key

### How do I get an API key?

Purchase a license at **[unrealsolutions.com/licensing](https://unrealsolutions.com/licensing.html)**. You'll receive your key via email.

### For how long does an API key work?

As long as you have a valid license.

### Where do I enter the API key?

Go to **Edit → Project Settings → Plugins → Runtime Video Recorder** and paste it into the **API KEY** field. See the [Installation Guide](./installation#step-3-—-set-your-api-key) for details.

## Subscription & Licensing

### Does the Subscription include all features and all platforms?

Yes. The Subscription version includes every feature and works on all supported platforms: Windows, MacOS, iOS, tvOS, Android, Oculus / Meta Quest, and Linux.

### Can I package my application using the Subscription version?

Yes. Your application needs an active internet connection for license validation. You can test the Subscription in **Shipping** configuration. Use the [sample project](https://drive.google.com/file/d/1GygW34E9h0CxcTM-7OvsvPXgN7aNSTi_/view?usp=drive_link) to verify the packaging process works correctly.

### What license does the plugin use?

The standard Unreal Engine plugin license and Epic Games EULA apply. See the full [Licensing details](https://unrealsolutions.com/licensing.html).

### I already bought the plugin — how do I use it now?

Please contact [business@unrealsolutions.com](mailto:business@unrealsolutions.com). You can continue using the version you purchased, but future engine upgrades and new features require an active license. Existing customers receive a discount.

## Platform Support

### Does it work on macOS?

Yes. macOS is fully supported with hardware-accelerated encoding via AVFoundation. iOS and tvOS are also supported.

### Can I test on Oculus / Meta Quest / Android?

Absolutely. All mobile and VR platforms are supported in both Subscription and licensed versions.

### Can I use the plugin with a Source / Custom engine build?

Yes, but only in the Editor. For full Source/Custom engine support (including packaging), the Perpetual license with full source code is required. For Editor-only testing, the Epic Launcher engine works fine.

## Editor & Build Configuration

### Can I use DebugGame Editor?

We recommend using **Development Editor** or **Development** instead. Unreal Engine may have difficulty compiling your project under the DebugGame configuration.

### Where are recorded videos saved?

When using `%auto%` as the filename, videos are saved to:

```
<PROJECT_DIR>/Saved/<timestamp>.mp4
```

You can also specify a custom output path. See the [Quick Start Guide](./quick-start#where-are-videos-saved) for details.

## Troubleshooting

### It doesn't work — what do I do?

1. **Make sure your API key is set** — see [Installation Step 3](./installation#step-3-—-set-your-api-key)
2. **Check the logs** — go to `<PROJECT_DIR>/Saved/Logs/` and look for errors
3. **Join Discord** and share your log file — we'll help you debug it

For a full list of common issues and fixes, see the [Troubleshooting](./troubleshooting) page.

## Still Have Questions?

- Join our [Discord community](https://discord.com/invite/pBDSCBcdgv) for quick answers
- Email [business@unrealsolutions.com](mailto:business@unrealsolutions.com) for licensing or business inquiries
