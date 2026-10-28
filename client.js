window.__ModuleLoader__.load({
  id: 'dsh-just-settings',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const primitives = require('@deepseek-ai/dsh-client-ui-primitives');

    /** Locale namespace owned by this plugin. */
    const NS = 'just-settings';

    /** English copy. */
    const en = {
      trigger: 'Settings',
      open: 'Open settings',
    };

    /** Chinese copy. */
    const zh = {
      trigger: '设置',
      open: '打开设置',
    };

    /** Plugin-owned stylesheet: mirrors the shell's settings trigger geometry. */
    const css = [
      '.djs-button{box-sizing:border-box;flex:1;min-width:0;height:42px;display:flex;align-items:center;gap:8px;margin:0;padding:0 10px 0 8px;border:none;border-radius:var(--dsw-radius-md);background:0 0;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:14px;line-height:22px;text-align:left;cursor:pointer;overflow:hidden}',
      '.djs-button:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.djs-button[data-collapsed="true"]{flex:none;justify-content:center;gap:0;width:36px;height:36px;padding:0}',
      '.djs-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    ].join('\n');

    /** Fallback gear used only if the shared primitives table lacks the shipped icon. */
    function GearIcon({ size = 16 }) {
      const teeth = [];
      for (let index = 0; index < 8; index += 1) {
        teeth.push(h('rect', {
          key: index,
          x: 10.6,
          y: 1.6,
          width: 2.8,
          height: 5,
          rx: 1,
          fill: 'currentColor',
          transform: `rotate(${index * 45} 12 12)`,
        }));
      }
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        'aria-hidden': true,
        focusable: 'false',
      }, ...teeth, h('circle', {
        cx: 12,
        cy: 12,
        r: 6.2,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2.6,
      }));
    }

    /**
     * Sidebar footer launcher: one click opens Settings directly.
     * @param props - sidebar geometry, settings navigation and localized copy.
     */
    function Launcher({ wide, settingsOpen, openSettings, t }) {
      const Icon = primitives?.IconSettingsOutlineMedium ?? GearIcon;
      return h('button', {
        type: 'button',
        className: 'djs-button',
        'data-collapsed': wide ? 'false' : 'true',
        'aria-label': t('open'),
        'aria-haspopup': 'dialog',
        'aria-expanded': settingsOpen === true,
        title: t('open'),
        onClick: openSettings,
      },
        h(Icon, { size: wide ? 16 : 18 }),
        wide ? h('span', { className: 'djs-label' }, t('trigger')) : null,
      );
    }

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'just-settings: dictionaries');
      ctx.effect(() => {
        const tag = document.createElement('style');
        tag.dataset.plugin = 'dsh-just-settings';
        tag.textContent = css;
        document.head.append(tag);
        return () => tag.remove();
      }, 'just-settings: styles');
      // Single slot: a lower priority shadows the shipped account launcher.
      ctx.slots.inject('settings.launcher', () => ctx.slots.register({
        name: 'settings.launcher',
        locale: NS,
        priority: -1,
      }, Launcher));
    }

    return {
      name: 'dsh-just-settings',
      inject: ['slots', 'locale'],
      apply,
    };
  },
});
