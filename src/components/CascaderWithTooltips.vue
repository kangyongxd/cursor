<template>
  <div>
    <Cascader
      :data="options"
      placeholder="请选择"
      style="width:300px;"
    />
    <br>
    <p>Hover over this <span data-title="This is an instant tooltip!">text</span>.</p>
  </div>
</template>

<script>
export default {
  name: 'CascaderWithTooltips',
  data() {
    return {
      options: [
        { value: '1', label: '非常非常非常长的选项文本示例 1——超过显示宽度时应显示 tooltip' },
        {
          value: '2',
          label: '第二项（也很长）',
          children: [
            { value: '2-1', label: '子项文本也很长，需要 tooltip 来完整展示示例' },
            { value: '2-2', label: '另一个子项示例' }
          ]
        },
        { value: '3', label: '短项' }
      ],
      _observer: null
    }
  },
  mounted() {
    // 监控 body 的新增节点，查找 iview cascader 菜单并为每一项设置 title
    this._observer = new MutationObserver(muts => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue
          // 菜单的根节点或包含菜单的容器
          if (node.classList.contains('ivu-cascader-menu') || node.querySelector && node.querySelector('.ivu-cascader-menu')) {
            // 延迟一个渲染帧，确保菜单项已渲染
            requestAnimationFrame(() => this._applyTitles(node))
          }
        }
      }
    })
    this._observer.observe(document.body, { childList: true, subtree: true })
  },
  beforeDestroy() {
    if (this._observer) {
      this._observer.disconnect()
      this._observer = null
    }
  },
  methods: {
    _applyTitles(rootNode) {
      const menuRoot = rootNode.classList.contains('ivu-cascader-menu') ? rootNode : rootNode.querySelector('.ivu-cascader-menu')
      if (!menuRoot) return
      // iview 不同版本类名差异，做多类名兼容
      const items = menuRoot.querySelectorAll('.ivu-cascader-menu-item')
      items.forEach(item => {
        // 防止重复设置
        if (item.dataset.tooltipSet === '1') return
        const text = (item.textContent || '').trim()
        if (text) {
          // item.setAttribute('title', text)
          item.setAttribute('data-title', text)
          item.dataset.tooltipSet = '1'
        }
      })
    }
  }
}
</script>

<style scoped>
/* 给下拉项加文本省略样式，便于展示 tooltip */
/deep/.ivu-cascader-menu-item {
  position: relative;
}

/deep/.ivu-cascader-menu-item:hover::after {
  content: attr(data-title);
  /* Add styling for your tooltip here (e.g., background, padding, border) */
  position: absolute;
  top: 100%; /* Adjust position as needed */
  left: 0;
  white-space: nowrap;
}
</style>