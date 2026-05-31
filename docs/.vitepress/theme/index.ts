import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import DiscordWidget from './DiscordWidget.vue'

// Extend the default VitePress theme and mount a floating "Join our Discord"
// widget at the bottom of every page via the `layout-bottom` slot.
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(DiscordWidget)
    })
  }
}
