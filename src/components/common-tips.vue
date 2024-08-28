<script lang="ts" setup>
const { t, locale } = useI18n()

const zhTips = [
  {
    key: 1,
    header: `免责声明`,
    content: `本站提供的信息、教程、代码和脚本等均来源于互联网和微软官方文档，且未进行逐个标注。所有展示的 Windows 或 Office 的 GVLK 和激活步骤均基于微软官方公示的资料。本站不拥有、搭建或维护任何 KMS 激活服务器，所展示的 KMS 服务器信息均来自互联网或第三方投稿，且默认为合法持有者公益共享。<br />本站不进行技术鉴别 KMS 服务器的合法性，若存在侵犯第三方权益的情况，将配合删除并维护权益。作为非盈利的技术学习交流平台，本站不对因使用本站信息造成的任何损害负责，用户在使用本站信息时，应自行确保不违反当地法律法规。通过访问或使用本站，即表示接受本站声明的约束。`,
  },
  {
    key: 2,
    header: `如何使用 KMS 服务器激活 Windows 系统和 Office 软件？`,
    content: `点击「下载」按钮下载 KMS 激活脚本，若浏览器提示存在安全风险，请点击「允许」按钮。下载完成后在文件资源管理器中找到 kms.bat 文件，右键选择「以管理员身份运行」选项，在终端弹出的弹窗中依次点击「确定」按钮，即可激活对应版本的 Windows 系统或 Office 软件。`,
  },
  {
    key: 3,
    header: `使用 KMS 服务器激活的原理是什么？`,
    content: `KMS 激活是微软为大型企业或机构设计的内部网络激活解决方案，允许企业通过内网的 KMS 服务器自动管理软件授权，实现设备的永久激活。尽管设计初衷是限于企业内网使用，但技术手段已使公网用户也能通过连接到公开的 KMS 服务器实现类似效果。KMS 激活有一个 180 天的有效期，系统默认每 7 天尝试自动续订，只要设备在 180 天内能连接到互联网，激活状态就会持续有效，从而实现实质上的永久激活。使用 KMS 激活时，应低调并注意来源的合法性与安全性。`,
  },
  {
    key: 4,
    header: `哪些 Windows 或 Office 版本不支持 KMS 激活？`,
    content: `Windows 操作系统有多种版本，包括面向开发者的 MSDN 版、笔记本品牌厂商的 OEM 版、正版光盘的 COEM 版、零售的 RTL 版，以及面向企业、政府和教育机构大量采购的 VOL 版。VOL 版适用于 KMS 激活，而 RTL 版则需通过更换密钥升级至 VOL 版才能使用 KMS 激活。用户可以通过检查镜像名称或使用命令提示符执行特定命令来确认 Windows 或 Office 是否为支持 KMS 激活的 VOL 版。`,
  },
  {
    key: 5,
    header: `激活后是正版吗？如何选择激活工具？`,
    content: `正版软件是一个法律概念，指的是合法授权使用的软件。对于希望免费使用但担心破解版带来问题的用户，他们通常寻求的“正版”实际上是指“原版”，即未被破解篡改的官方版本。首选的激活方式是使用零售密钥或批量 MAK 密钥，其次是通过 KMS 激活。尽管存在破解软件，但这些方法存在安全风险，不推荐使用。微软公司及其创始人比尔·盖茨在慈善方面的慷慨被广泛认可，但这并不意味着可以滥用其产品的授权政策。因此，当条件允许时，应购买并支持正版软件，尊重软件开发者的劳动成果。`,
  },
]

const enTips = [
  {
    key: 1,
    header: `Disclaimer`,
    content: `The information, tutorials, code, and scripts provided on this site are sourced from the internet and official Microsoft documentation, and individual references are not listed. All GVLK keys and activation steps for Windows or Office displayed here are based on publicly available Microsoft documentation. This site does not own, set up, or maintain any KMS activation servers. All KMS server information displayed is sourced from the internet or third-party submissions, and it is assumed that these are shared by legitimate owners for public benefit.<br />This site does not verify the legality of KMS servers, and if any third-party rights are infringed, we will cooperate in deleting the content and protecting their rights. As a non-profit platform for technical learning and exchange, this site is not responsible for any damage caused by using the information provided. Users are responsible for ensuring that they do not violate local laws and regulations when using the information. By accessing or using this site, you agree to be bound by this disclaimer.`,
  },
  {
    key: 2,
    header: `How to Activate Windows and Office Software Using a KMS Server?`,
    content: `Click the "Download" button to download the KMS activation script. If your browser warns of a security risk, click the "Allow" button. After downloading, locate the kms.bat file in File Explorer, right-click it, and select "Run as administrator." In the terminal window that pops up, click the "OK" button to activate the corresponding version of Windows or Office software.`,
  },
  {
    key: 3,
    header: `How Does KMS Activation Work?`,
    content: `KMS activation is an internal network activation solution designed by Microsoft for large enterprises or institutions. It allows companies to manage software licenses automatically through an internal KMS server, achieving permanent activation of devices. Although originally intended for enterprise intranets, technical methods have allowed public users to connect to open KMS servers for similar activation results. KMS activation has a 180-day validity period, with the system automatically attempting to renew every 7 days. As long as the device connects to the internet within the 180-day period, the activation status will remain valid, effectively achieving permanent activation. When using KMS activation, it is advisable to remain discreet and be aware of the legality and security of the sources.`,
  },
  {
    key: 4,
    header: `Which Versions of Windows or Office Do Not Support KMS Activation?`,
    content: `There are various versions of the Windows operating system, including the developer-oriented MSDN version, the OEM version for laptop manufacturers, the COEM version for retail disks, the RTL version for retail, and the VOL version for enterprises, governments, and educational institutions that purchase in bulk. The VOL version is suitable for KMS activation, while the RTL version requires a key replacement upgrade to the VOL version to use KMS activation. Users can check the image name or use specific commands in the command prompt to confirm whether their version of Windows or Office supports KMS activation as a VOL version.`,
  },
  {
    key: 5,
    header: `Is It Genuine After Activation? How Should You Choose an Activation Tool?`,
    content: `Genuine software is a legal concept that refers to software legally authorized for use. For users who wish to use software for free but are concerned about issues with cracked versions, what they are usually looking for is "original," meaning an official version that has not been tampered with. The preferred activation method is to use a retail key or a volume MAK key, followed by KMS activation. Although there are cracking tools available, they pose security risks and are not recommended. While Microsoft and its founder, Bill Gates, are widely recognized for their philanthropy, this does not justify abusing their product licensing policies. Therefore, when possible, you should purchase and support genuine software to respect the efforts of software developers.`,
  },
]

const tips = computed(() => {
  if (locale.value === 'zh-cn' || locale.value === 'zh-tw') {
    return zhTips
  } else {
    return enTips
  }
})
</script>

<template>
  <ACard>
    <template #title>
      <div class="flex items-center gap-2">
        <i :class="`i-icons:tips`" />
        <span>{{ t('title.tips') }}</span>
      </div>
    </template>
    <ACollapse :default-active-key="[1]">
      <ACollapseItem v-for="{ key, header, content } in tips" :key :header>
        <span class="leading-relaxed select-text" v-html="content"></span>
      </ACollapseItem>
    </ACollapse>
  </ACard>
</template>
