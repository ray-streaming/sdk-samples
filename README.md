#### Starter

1. 应用服务申请需要到平台上启动

- Paas 端：https://console.doulongyun.com/cloud-gaming/manager/game
- 云手机端：https://console.doulongyun.com/cloud-phone/create-instance

2. 应用启动后获取对应的参数

- Paas 端：进入 https://console.doulongyun.com/cloud-gaming/real-time
  点击表格操作栏的直连信息，获取身份信息`token`、信令服务器域名地址`address`、ice 服务域名地址`url`；
  根据`address`和`token`拼接成信令地址`signaling`：`wss://${address}/clientWebsocket/${token}`。根据`url`拼接 ice 配置`iceConfig`。

```typescript
const iceConfig = [
  {
    urls: `stun:${url}:3478`, // 默认端口3478
    username: xxx,
    credential: yyy,
  },
  {
    urls: `turn:${url}:3478`, // 默认端口3478
    username: xxx,
    credential: yyy,
  },
]
// Paas启动的PC应用
const launcher = new Launcher(signaling, iceConfig, hostElement)
// Paas启动的移动端应用
const launcher = new MobileLauncher(signaling, iceConfig, hostElement)
```

- 云手机端：进入 https://console.doulongyun.com/cloud-phone/vm-node
  点击表格操作栏的直连信息，获取身份信息`token`、信令服务器域名地址`address`、ice 服务域名地址`url`，
  根据`address`和`token`拼接成信令地址`signaling`：`wss://${address}/signaling/client/${token}`，根据`url`拼接成 ice 配置`iceConfig`。

```typescript
const iceConfig = [
  {
    urls: `stun:${url}:3478`, // 默认端口3478
    username: xxx,
    credential: yyy,
  },
  {
    urls: `turn:${url}:3478`, // 默认端口3478
    username: xxx,
    credential: yyy,
  },
]
const launcher = new MobileLauncher(signaling, iceConfig, hostElement)
```

3. 虚拟按键编辑地址

- https://console.doulongyun.com/cloud-gaming/manager/control

#### React 例子

1. Paas 端启动的 PC 端推流应用

- https://github.com/ray-streaming/sdk-samples/blob/master/react-demo/src/launcher.tsx

2. 云手机端启动的推流应用以及 Paas 端启动的手机应用

- https://github.com/ray-streaming/sdk-samples/blob/master/react-demo/src/mobile-launcher.tsx

#### Vue 例子

1. Paas 端启动的 PC 端推流应用

- https://github.com/ray-streaming/sdk-samples/blob/master/vue-demo/src/setup-launcher.vue

2. 云手机端启动的推流应用以及 Paas 端启动的手机应用

- https://github.com/ray-streaming/sdk-samples/blob/master/vue-demo/src/setup-mobile-launcher.vue

#### Svelte 例子

1. Paas 端启动的 PC 端推流应用

- https://github.com/ray-streaming/sdk-samples/blob/master/svelte-demo/src/launcher.svelte

2. 云手机端启动的推流应用以及 Paas 端启动的手机应用

- https://github.com/ray-streaming/sdk-samples/blob/master/svelte-demo/src/mobile-launcher.svelte

#### vanilla-js 例子

- https://github.com/ray-streaming/sdk-samples/blob/master/vanilla-demo/src/index.js

#### umd 例子

- https://github.com/ray-streaming/sdk-samples/blob/master/pure-html-demo/index.html

#### Launcher 功能

1. 虚拟键盘

```typescript
// 开启
launcher.showKeyboard()
// 关闭
launcher.hideKeyboard()
```

2. IME 键盘(手机自带键盘)

```typescript
//开启
launcher.wakeOnIME()
```

3. 虚拟手柄

```typescript
// 开启
launcher.showJoyStick()
// 关闭
launcher.hideJoyStick()
```

4. 自定义虚拟按键

```typescript
const config = [
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
const id = launcher.createOnScreenControlsProfile('control1', config)
// 开启某个虚拟按键配置，参数可选，不传默认第一个
launcher.showOnScreenControlsByProfileId(id)
// 关闭
launcher.hideOnScreenControls()
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
launcher.sendMobileAction(keycode, MobileKeysActionType.ActionDown)
// 抬起
launcher.sendMobileAction(keycode, MobileKeysActionType.ActionUp)
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

- 初始化`Launcher`或者`MobileLauncher`时候需要传入 options: `autorunRivatuner: true`
- 说明: 
  - fps: 帧数
  - latency: 客户端与节点端服务之间来回的时间，单位: ms
  - rtt: 客户端与ICE服务器之间来回的时间，单位: ms
  - packetLossRate: 丢包率
  - bitrate: 单位: kbps
- 例子: https://github.com/ray-streaming/sdk-samples/blob/master/react-demo/src/launcher.tsx
- 其他：参考 https://www.w3.org/TR/webrtc-stats/#stats-dictionaries

```typescript
const launcher = new Launcher(url, iceConfig, hostElement, {
  autorunRivatuner: true,
})
window.setInterval(() => {
  // info 为所需要的网络信息
  const info = launcher.report()
})
```
