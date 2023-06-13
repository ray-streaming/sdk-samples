### 快速接入

1. 启动应用

- 云游戏服务：[云游戏服务 -> 云游戏管理 -> 游戏管理 -> 操作列启动按钮](https://console.doulongyun.com/cloud-gaming/manager/game)
- 云手机：[云手机 -> 实例管理 -> 创建实例按钮](https://console.doulongyun.com/cloud-phone/create-instance)

2. 获取实例化参数

- 云游戏服务：[云游戏服务 -> 实时进程](https://console.doulongyun.com/cloud-gaming/real-time)，点击操作列中直连信息。
- 云手机：[云游戏 -> 实例管理](https://console.doulongyun.com/cloud-phone/vm-node)，点击操作列中直连信息。

从弹出侧栏的“Web直连信息”中获得以下字段信息：

| 字段名  | 说明         |
| ------- | ------------ |
| token   | 应用唯一标识 |
| address | 信令服务地址 |
| url     | ICE 服务地址 |

3. 使用上述信息初始化 `signaling` 与 `iceConfig` 变量

```typescript
// 所有服务的 iceConfig 配置一致
const iceConfig = [
  {
    urls: `turn:${url}:3478`, // 默认端口 3478
    username: 'coturn',       // 默认用户 coturn
    credential: '123456',     // 默认凭据 123456
  },
]
// 云游戏服务信令地址
const signaling = `wss://${address}/clientWebsocket/${token}`
// 云手机信令地址
const signaling = `wss://${address}/signaling/client/${token}`
```

4. 初始化实例

连接实例前两个参数由步骤 3 提供，`hostElement` 为任意固定尺寸的 HTML 元素。

不同应用类型 Launcher 不一致，若类型不匹配虽连接仍可建立但事件转换不一致会导致无法交互。

```typescript
// 如果启动的是 Windows 应用
const launcher = new Launcher(signaling, iceConfig, hostElement)
// 如果启动的是 Android 应用
const launcher = new MobileLauncher(signaling, iceConfig, hostElement)
```

### DEMO

#### React

- [Windows 应用](https://github.com/ray-streaming/sdk-samples/blob/master/react-demo/src/launcher.tsx)
- [Android 应用](https://github.com/ray-streaming/sdk-samples/blob/master/react-demo/src/mobile-launcher.tsx)

#### Vue.js

1. [Windows 应用](https://github.com/ray-streaming/sdk-samples/blob/master/vue-demo/src/setup-launcher.vue)

2. [Android 应用](https://github.com/ray-streaming/sdk-samples/blob/master/vue-demo/src/setup-mobile-launcher.vue)

#### Svelte

1. [Windows 应用](https://github.com/ray-streaming/sdk-samples/blob/master/svelte-demo/src/launcher.svelte)

2. [Android 应用](https://github.com/ray-streaming/sdk-samples/blob/master/svelte-demo/src/mobile-launcher.svelte)

#### [Vanilla JS](https://github.com/ray-streaming/sdk-samples/blob/master/vanilla-demo/src/index.js)

#### [UMD](https://github.com/ray-streaming/sdk-samples/blob/master/pure-html-demo/index.html)

### Launcher 功能

1. 虚拟键盘

```typescript
// 开启
launcher.showKeyboard()
// 关闭
launcher.hideKeyboard()
```

2. IME 键盘(手机默认输入法)

```typescript
// 唤起
launcher.wakeOnIME()
```

3. 虚拟摇杆

```typescript
// 开启
launcher.showJoyStick()
// 关闭
launcher.hideJoyStick()
```

4. 自定义虚拟按键

使用[虚拟控件编辑器](https://console.doulongyun.com/public-share/virtual-control-editor/)创建控件布局，复制键盘配置初始化 `layout` 变量。

```typescript
// 这里创建了一个 S 按键
const layout = [
  {
    xPercent: 0.11299435028248588,
    yPercent: 0.6782128514056225,
    widthPercent: 0.1,
    heightPercent: 0.17771084337349397,
    codes: 83,
    showName: '',
    schemeKeys: 'S',
    aspectRatio: 1,
    srcList: [],
    type: 0,
    opacity: 1,
    anchor: 'screen',
  },
]
// 创建一个虚拟控件布局，返回值为该布局的唯一标识
const id = launcher.createOnScreenControlsProfile('control_name', layout)
// 显示指定 id 的虚拟控件布局，参数可选，不传默认显示第一个
launcher.showOnScreenControlsByProfileId(id)
// 关闭
launcher.hideOnScreenControls()
```

5. 文件上传

```javascript
// file 为浏览器 File 对象
launcher.uploadFile(file, (e) => {
  if (e.state === 'progress') {
    // 发送进度 [0-100]
    console.log(e.progress)
  } else if (e.state === 'error') {
    // 远端拒绝接或者发送错误
    console.error(e.reason)
  } else if (e.state === 'done') {
    console.log('done')
  }
})
```

### MobileLauncher 功能

1. 发送手机功能键

```typescript
enum MobileKeysKeycode {
  KeycodeHome = 3,
  KeycodeBack = 4,
  KeycodeVoiceUp = 24,
  KeycodeVoiceDown = 25,
  KeycodeAppSwitch = 187,
}
enum MobileKeysActionType {
  ActionDown,
  ActionUp,
}
const keycode = MobileKeysKeycode.KeycodeHome
// 按下
mobileLauncher.sendMobileAction(keycode, MobileKeysActionType.ActionDown)
// 抬起
mobileLauncher.sendMobileAction(keycode, MobileKeysActionType.ActionUp)
```

2. 调整码率
```typescript
// 单位 kbps
mobileLauncher.connection.changeBandwidthByRenegotiation(1500)
```

### Launcher 和 MobileLauncher 共有功能

1. 放大镜

```typescript
// 开启
launcher.showMagnifier()
// 关闭
launcher.hideMagnifier()
```

2. 导出日志

```typescript
launcher.exportLog()
```

3. 展示网络情况面板

```typescript
// 开启
launcher.showDashboard()
// 关闭
launcher.hideDashboard()
```

4. 销毁

```typescript
launcher.destory()
```

5. 获取网络信息

- 初始化 `Launcher` 或者 `MobileLauncher` 时候需要传入 options:  `autorunRivatuner: true`
- 说明:
  - fps: 帧数
  - latency: 客户端与节点端服务之间往返时间，单位: ms
  - rtt: 客户端与 ICE 服务器之间往返时间，单位: ms
  - packetLossRate: 丢包率
  - bitrate: 单位: kbps
- [例子](https://github.com/ray-streaming/sdk-samples/blob/master/react-demo/src/launcher.tsx)
- 其他字段参考: [Stats dictionaries](https://www.w3.org/TR/webrtc-stats/#stats-dictionaries)

```typescript
const launcher = new Launcher(url, iceConfig, hostElement, {
  autorunRivatuner: true,
})
window.setInterval(() => {
  // info 为所需要的网络信息
  const info = launcher.report()
})
```
