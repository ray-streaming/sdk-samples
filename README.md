### 快速接入

1. 启动应用

- 云游戏服务：[云游戏服务 -> 云游戏管理 -> 游戏管理 -> 操作列启动按钮](https://console.doulongyun.com/cloud-gaming/manager/game)
- 云手机：[云手机 -> 实例管理 -> 创建实例按钮](https://console.doulongyun.com/cloud-phone/create-instance)

2. 获取实例化参数

- 云游戏服务：[云游戏服务 -> 实时进程](https://console.doulongyun.com/cloud-gaming/real-time)，点击操作列中直连信息。
- 云手机：[云游戏 -> 实例管理](https://console.doulongyun.com/cloud-phone/vm-node)，点击操作列中直连信息。

从弹出侧栏的“Web 直连信息”的 URL 参数中获得以下字段信息：

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
    username: "coturn",       // 默认用户 coturn
    credential: "123456",     // 默认凭据 123456
  },
];
// 云游戏服务信令地址
const signaling = `wss://${address}/clientWebsocket/${token}`;
// 云手机信令地址
const signaling = `wss://${address}/signaling/client/${token}`;
```

4. 初始化实例

连接实例前两个参数由步骤 3 提供，`hostElement` 为任意固定尺寸的 HTML 元素。

不同应用类型 Launcher 不一致。若类型不匹配连接仍可建立，但事件转换会不一致导致无法交互。

```typescript
// 如果启动的是 Windows 应用
const launcher = new Launcher(signaling, iceConfig, hostElement);
// 如果启动的是 Android 应用
const launcher = new MobileLauncher(signaling, iceConfig, hostElement);
```

### 功能与方法

#### Windows 应用独有功能

##### 虚拟键盘

```typescript
// 开启
launcher.showKeyboard();
// 关闭
launcher.hideKeyboard();
```

##### IME 键盘(手机默认输入法)

```typescript
// 唤起
launcher.wakeOnIME();
```

##### 虚拟摇杆

```typescript
// 开启
launcher.showJoyStick();
// 关闭
launcher.hideJoyStick();
```

##### 切换触控板模式

###### 默认（不开启）

不显示指针，支持以下交互：

- 左击（轻触）
- 拖动
- 右击（长按）

###### 触控（direct 模式）

显示指针，指针跟随触点位置移动，支持以下交互：

- 左击（轻触）
- 移动（滑动）
- 拖动（长按滑动）
- 右击（双击）

###### 拖动（relative 模式）

显示指针，指针相对触点移动偏移量变动位置，支持以下交互：

- 左击（轻触）
- 移动（滑动）
- 拖动（长按滑动）
- 右击（双击）

```typescript
// 启用拖动模式
launcher.enableTrackpad("relative");
// 启用触控模式
launcher.enableTrackpad("direct");
// 禁用触控板
launcher.disableTrackpad();
```

##### 自定义虚拟控件布局

使用[虚拟控件编辑器](https://console.doulongyun.com/public-share/virtual-control-editor/)创建控件布局，单击“复制键盘配置”，将复制的内容赋值给 `layout` 变量。

```typescript
// 这里作为演示只创建了一个 S 按键
const layout = [
  {
    xPercent: 0.11299435028248588,
    yPercent: 0.6782128514056225,
    widthPercent: 0.1,
    heightPercent: 0.17771084337349397,
    codes: 83,
    showName: "",
    schemeKeys: "S",
    aspectRatio: 1,
    srcList: [],
    type: 0,
    opacity: 1,
    anchor: "screen",
  },
];
// 创建一个虚拟控件布局，返回值为该布局的唯一标识
const id = launcher.createOnScreenControlsProfile("control_name", layout);
// 显示指定 id 的虚拟控件布局，参数可选，不传默认显示第一个
launcher.showOnScreenControlsByProfileId(id);
// 关闭
launcher.hideOnScreenControls();
```

##### 文件上传

```javascript
// file 为浏览器 File 对象
launcher.uploadFile(file, (e) => {
  if (e.state === "progress") {
    // 发送进度 [0-100]
    console.log(e.progress);
  } else if (e.state === "error") {
    // 远端拒绝接或者发送错误
    console.error(e.reason);
  } else if (e.state === "done") {
    console.log("done");
  }
});
```

##### 变更编码器设定

```typescript
// 修改推流端编码器的设置
launcher.changeCodecOptions({
  bitrate: 3000,   // 码率
  framerate: 30,   // 帧率
  gopLength: 250,  // I 帧间隔
});
// 如果只需改变码率
launcher.changeCodecOptions({ bitrate: 3000 });
```

##### 变更分辨率

```typescript
// 修改分辨率为 HD
launcher.changeResolution(1280, 720);
```

#### Android 应用独有功能

##### 发送手机功能键

```typescript
const MobileKeysKeycode {
  KeycodeHome: 3,         // Home 键
  KeycodeBack: 4,         // 返回键
  KeycodeVoiceUp: 24,     // 音量 + 键
  KeycodeVoiceDown: 25,   // 音量 - 键
  KeycodeAppSwitch: 187,  // 应用切换键
}
const MobileKeysActionType {
  ActionDown: 0,  // 按下
  ActionUp: 1,    // 抬起
}
// 发送一次 Home 键单击
launcher.sendMobileAction(MobileKeysKeycode.KeycodeHome, MobileKeysActionType.ActionDown);
launcher.sendMobileAction(MobileKeysKeycode.KeycodeHome, MobileKeysActionType.ActionUp);
```

##### 变更码率

```typescript
// 单位 kbps
launcher.connection.changeBandwidthByRenegotiation(1500);
```

##### 变更分辨率比例

```typescript
// 范围 [0-1]
launcher.connection.changeMobileResolutionScale(0.5);
```

### 通用功能

##### 放大镜

```typescript
// 开启
launcher.showMagnifier();
// 关闭
launcher.hideMagnifier();
```

##### 获取统计信息

```typescript
// 开关统计信息
launcher.toggleStatistics();
// 开启后可以通过以下方法获得统计数据
window.setInterval(() => {
  const { rtt, fps, bitrate, packetLossRate, latency } = launcher.report();
  console.log(`
    FPS: ${fps}
    rtt: ${rtt}ms
    latency: ${latency}ms
    biterate: ${bitrate}kbps
    packetLossRate: ${(packetLossRate * 100).toFixed(3)}%
  `);
}, 1000);
```

主要字段说明:

- fps: 帧数
- latency: 客户端与节点端服务之间往返时间，单位 ms
- rtt: 客户端与 ICE 服务器之间往返时间，单位 ms
- packetLossRate: 丢包率
- bitrate: 视频流码率，单位 kbps

其他字段参考: [Stats dictionaries](https://www.w3.org/TR/webrtc-stats/#stats-dictionaries)

##### 导出日志

```typescript
launcher.exportLog();
```

##### 销毁

```typescript
launcher.destory();
```

### 实例化参数说明

```javascript
// Windows 应用
new Launcher(url, iceServers, hostElement[, options])
// Android 应用
new MobileLauncher(url, iceServers, hostElement[, options])
```

##### 必填参数说明

| 字段        | 类型           | 说明                                                                                                              |
| ----------- | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| url         | string         | 最终的信令 URL，参照[快速接入](https://github.com/ray-streaming/sdk-samples#%E5%BF%AB%E9%80%9F%E6%8E%A5%E5%85%A5) |
| iceServers  | RTCIceServer[] | ICE 服务配置，参照[快速接入](https://github.com/ray-streaming/sdk-samples#%E5%BF%AB%E9%80%9F%E6%8E%A5%E5%85%A5)   |
| hostElement | HTMLElement    | 任意固定尺寸的 HTML 元素                                                                                          |

##### 可选参数 `options` 包含字段及其说明

| 字段               | 类型                                        | 默认值   | 说明                                                                |
| ------------------ | ------------------------------------------- | -------- | ------------------------------------------------------------------- |
| autorunRivatuner   | boolean                                     | false    | 是否自动开启数据统计                                                |
| orientationLock    | boolean                                     | false    | 开启后流内容不再自动旋转                                            |
| enableControlPanel | boolean                                     | false    | 是否开启默认的控制面板                                              |
| themeColor         | string                                      | 'ff0000' | 虚拟控件（如果有）的主题色                                               |
| onPhaseChange      | `(phase: Phase, deltaTime: number) => void` | noop     | 每当阶段变化会产生一次事件，参数二为两次事件的间隔，详见 Phase 说明 |

##### `Launcher` 独有的可选参数

| 字段                  | 类型    | 默认值 | 说明                                                   |
| --------------------- | ------- | ------ | ------------------------------------------------------ |
| disableFileTransfer   | boolean | false  | 是否拒绝接收远端推送的文件                             |
| disablePointerManager | boolean | false  | 是否禁用指针样式同步                                   |
| disablePointerLock    | boolean | false  | 是否禁用指针锁定（即使没有指针也不进入相对移动模式）   |
| enableClipboard       | boolean | false  | 是否开启剪贴板同步                                     |
| useClassicEvent       | boolean | false  | 是否使用 `mouseevent` 替代 `pointerevent` 作为指针事件 |

##### Phase 说明

| 阶段                      | 说明                                                           |
| ------------------------- | -------------------------------------------------------------- |
| initial                   | 初始阶段，刚实例化后或断网重连后进入该阶段                     |
| signaling-connected       | 浏览器端与信令建立连接成功，该阶段能响应信令消息               |
| node-ready                | 节点与信令建立连接成功，标志着浏览器端可以开始与推流端交换候选 |
| end-candidate             | 交换候选结束                                                   |
| peer-connection-connected | WebRTC 连接建立成功                                            |
| bandwidth-detect          | 如果开启了自动测速，会有这个阶段以检测带宽                     |
| data-channel-open         | 数据通道打开，标志着可以进行交互                               |
| loaded-metadata           | 视频流开始播放                                                 |

### 事件

如需自行处理一些流程，可以通过 `launcher.connection.event.[on|off|once|emit]` 进行交互。

| event name           | 发送时间点/说明                                           | payload                                                     |
| -------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| connect              | 收到信令的 connect 事件时                                 | `ConnectMSG`                                                |
| afk                  | 收到信令的 operateOverTime 事件时                         | `number`                                                    |
| open                 | 与信令的 WebSocket 连接建立成功后                         | `Event`                                                     |
| close                | 与信令的 WebSocket 连接关闭后                             | `CloseEvent`                                                |
| queue                | 收到信令的 queue 事件时                                   | `number`                                                    |
| ready                | 收到信令的 ready 事件时                                   | `ReadyMSG`                                                  |
| endCandidate         | 连接双方完成 ICE 候选地址的交换时                         | `RTCPeerConnectionIceEvent`                                 |
| cursor               | 推流端光标有变化时                                        | `Cursor`                                                    |
| handUp               | 当推流端与信令失联时                                      | `void`                                                      |
| disconnect           | 收到信令的 peerDisconnected 事件或 WebSocket 链接断开始时 | `string`                                                    |
| receivedLink         | 推流端捕获到超链接时                                      | `string`                                                    |
| receivedTrack        | 实例接收到媒体轨道时；payload 为该轨道                    | `MediaStreamTrack`                                          |
| dataChannelConnected | DataChannel 实例打开时；当收到该事件时说明可以开始交互    | `Event`                                                     |
| interaction          | 推流端运行的应用利用 socket 发送事件时                    | `string | ArrayBuffer`                                     |
| kick                 | 收到信令的 kick 事件时                                    | `{ base64: string, show: boolean, x: number, y: number }`   |
| networkChanged       | PeerConnection 检测到网络变化时                           | `string`                                                    |
| echo                 | 收到响应的 echo 消息时；payload 为该次往返时间            | `number`                                                    |
| screenshot           | 完整接收完截图数据时；payload 为截图数据                  | `Blob`                                                      |
| screenshotData       | 收到截图数据时；payload 为数据字节长度                    | `number`                                                    |
| kickOut              | 收到踢人消息时                                            | `string`                                                    |
| clipboard            | 完整接收完剪贴板数据时；payload 为剪贴板数据              | `string | Blob`                                            |
| videoSettings        | 收到视频编码配置时                                        | `{ framerate: number; bitrate: number; gopLength: number }` |
| mobileResolutionInfo | 收到 Android 的分辨率数据时                               | `{ width: number; height: number; scale: number }`          |
| resolutionInfo       | 收到 Windows/Linux 的分辨率数据时                         | `[number, number, number][]`                                |

### 建议兼容性使用

##### 桌面端

| Feature      | Chrome | Edge | Firefox | Opera | Safari |
| ------------ | ------ | ---- | ------- | ----- | ------ |
| 最低需求     | 64     | 79   | 69      | 58    | 13.1   |
| 支持所有特性 | 71     | 79   | 69      | 63    | 13.1   |

##### 移动端

| Feature      | Chrome Android | Firefox for Android | Opera Android | Safari on iOS | Samsung Internet | WebView Android |
| ------------ | -------------- | ------------------- | ------------- | ------------- | ---------------- | --------------- |
| 最低需求     | 64             | 79                  | 47            | 13.4          | 9.0              | 64              |
| 支持所有特性 | 84             | 79                  | 50            | 13.4          | 10.0             | 84              |
