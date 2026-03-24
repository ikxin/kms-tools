/**
 * KMS 产品数据库 — 从原版 C 代码的 kmsdata-full.c / kmsdata.h 中提取
 *
 * 包含 CSVLK（客户端-服务器卷许可密钥）、应用程序、KMS 项目、SKU 和主机构建信息。
 * 数据通过编译一个小型 C 程序对 kmsdata-full.c 中的 VlmcsdHeader_t 结构序列化为 JSON 后提取。
 *
 * 参考原版源码:
 *   - src/kmsdata-full.c  (产品数据的二进制 blob)
 *   - src/kmsdata.h        (VlmcsdHeader_t 结构定义)
 */

// ─── 数据接口定义 (对应 src/kmsdata.h 中的结构体) ────────────────────────────

/** CSVLK 数据项 — 对应 CsvlkData_t，包含 ePID 模板和密钥范围 */
export interface CsvlkItem {
  ePid: string // ePID 模板字符串
  ePidGroup: string // ePID 分组名称（如 Windows、Office2010）
  groupId: number // 分组 ID
  minKeyId: number // 最小密钥 ID
  maxKeyId: number // 最大密钥 ID
  minActiveClients: number // 最小活跃客户端数
  releaseDate: number // 发布日期（Unix 时间戳）
}

/** 应用程序项 — 对应 kmsdata.h 中的应用数据 */
export interface AppItem {
  guid: string // 应用程序 GUID
  name: string // 应用程序名称
  nCountPolicy: number // N 计数策略（最小客户端数）
}

/** KMS 项目 — 对应 KmsData_t，描述可激活的产品组 */
export interface KmsItem {
  guid: string // KMS 计数 ID (GUID)
  name: string // 产品组名称
  appIndex: number // 关联的应用程序索引
  ePidIndex: number // 关联的 ePID 索引
  nCountPolicy: number // N 计数策略
  protocolVersion: number // 协议版本（4/5/6）
  isRetail: number // 是否为零售版
  isPreview: number // 是否为预览版
}

/** SKU 项目 — 描述具体的产品 SKU（最终用户可见的产品） */
export interface SkuItem {
  guid: string // 激活 ID (SKU GUID)
  name: string // 产品名称
  appIndex: number // 关联的应用程序索引
  kmsIndex: number // 关联的 KMS 项目索引
  protocolVersion: number // 协议版本
  nCountPolicy: number // N 计数策略
  isRetail: number // 是否为零售版
  isPreview: number // 是否为预览版
  ePidIndex: number // 关联的 ePID 索引
}

/** 主机构建信息 — 对应 VlmcsdHeader_t 中的构建信息 */
export interface HostBuild {
  buildNumber: number // Windows 构建号
  platformId: number // 平台 ID
  displayName: string // 显示名称
  flags: number // 标志位（UseNdr64, UseForEpid, MayBeServer）
  releaseDate: number // 发布日期（Unix 时间戳）
}

/** KMS 数据库总结构 — 对应 VlmcsdHeader_t */
export interface KmsDatabase {
  csvlkCount: number
  appItemCount: number
  kmsItemCount: number
  skuItemCount: number
  hostBuildCount: number
  csvlkData: CsvlkItem[]
  appItems: AppItem[]
  kmsItems: KmsItem[]
  skuItems: SkuItem[]
  hostBuilds: HostBuild[]
}

// ─── 主机构建标志位 (参考 src/kmsdata.h) ────────────────────────────────────

/** 使用 NDR64 传输语法 */
export const UseNdr64 = 1 << 0
/** 用于 ePID 生成 */
export const UseForEpid = 1 << 1
/** 可能是服务器版本 */
export const MayBeServer = 1 << 2

// ─── 产品数据库 (从 src/kmsdata-full.c 提取) ────────────────────────────────

export const KmsData: KmsDatabase = {
  csvlkCount: 6,
  appItemCount: 3,
  kmsItemCount: 29,
  skuItemCount: 202,
  hostBuildCount: 6,
  csvlkData: [
    {
      ePid: '03612-00206-556-123727-03-1033-17763.0000-2972018',
      ePidGroup: 'Windows',
      groupId: 206,
      minKeyId: 551000000,
      maxKeyId: 570999999,
      minActiveClients: 0,
      releaseDate: 1538438400
    },
    {
      ePid: '03612-00096-199-799188-03-1033-17763.0000-2972018',
      ePidGroup: 'Office2010',
      groupId: 96,
      minKeyId: 199000000,
      maxKeyId: 217999999,
      minActiveClients: 0,
      releaseDate: 1279152000
    },
    {
      ePid: '03612-00206-240-719639-03-1033-17763.0000-2972018',
      ePidGroup: 'Office2013',
      groupId: 206,
      minKeyId: 234000000,
      maxKeyId: 255999999,
      minActiveClients: 0,
      releaseDate: 1359417600
    },
    {
      ePid: '03612-00206-438-004532-03-1033-17763.0000-2972018',
      ePidGroup: 'Office2016',
      groupId: 206,
      minKeyId: 437000000,
      maxKeyId: 458999999,
      minActiveClients: 0,
      releaseDate: 1442880000
    },
    {
      ePid: '03612-03858-053-089516-03-1033-17763.0000-2972018',
      ePidGroup: 'WinChinaGov',
      groupId: 3858,
      minKeyId: 15000000,
      maxKeyId: 999999999,
      minActiveClients: 0,
      releaseDate: 1491350400
    },
    {
      ePid: '03612-00206-684-137669-03-1033-17763.0000-2972018',
      ePidGroup: 'Office2019',
      groupId: 206,
      minKeyId: 666000000,
      maxKeyId: 685999999,
      minActiveClients: 0,
      releaseDate: 1537747200
    }
  ],
  appItems: [
    {
      guid: '55c92734-d682-4d71-983e-d6ec3f16059f',
      name: 'Windows',
      nCountPolicy: 50
    },
    {
      guid: '59a52881-a989-479d-af46-f275c6370663',
      name: 'Office2010',
      nCountPolicy: 10
    },
    {
      guid: '0ff1ce15-a989-479d-af46-f275c6370663',
      name: 'Office2013+',
      nCountPolicy: 10
    }
  ],
  kmsItems: [
    {
      guid: '8449b1fb-f0ea-497a-99ab-66ca96e9a0f5',
      name: 'Windows Server 2019',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 5,
      protocolVersion: 6,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '11b15659-e603-4cf1-9c1f-f0ec01b81888',
      name: 'Windows 10 2019 (Volume)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 25,
      protocolVersion: 6,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: 'd27cd636-1962-44e9-8b4f-27b6c23efb85',
      name: 'Windows 10 Unknown (Volume)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 25,
      protocolVersion: 6,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '7ba0bf23-d0f5-4072-91d9-d55af5a481b6',
      name: 'Windows 10 China Government',
      appIndex: 0,
      ePidIndex: 4,
      nCountPolicy: 25,
      protocolVersion: 6,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '969fe3c0-a3ec-491a-9f25-423605deb365',
      name: 'Windows 10 2016 (Volume)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 25,
      protocolVersion: 6,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: 'e1c51358-fe3e-4203-a4a2-3b6b20c9734e',
      name: 'Windows 10 (Retail)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 25,
      protocolVersion: 6,
      isRetail: 1,
      isPreview: 0
    },
    {
      guid: '58e2134f-8e11-4d17-9cb2-91069c151148',
      name: 'Windows 10 2015 (Volume)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 25,
      protocolVersion: 6,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '7fde5219-fbfa-484a-82c9-34d1ad53e856',
      name: 'Windows 7',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 25,
      protocolVersion: 4,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: 'bbb97b3b-8ca4-4a28-9717-89fabd42c4ac',
      name: 'Windows 8 (Retail)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 25,
      protocolVersion: 5,
      isRetail: 1,
      isPreview: 0
    },
    {
      guid: '3c40b358-5948-45af-923b-53d21fcc7e79',
      name: 'Windows 8 (Volume)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 25,
      protocolVersion: 5,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '6d646890-3606-461a-86ab-598bb84ace82',
      name: 'Windows 8.1 (Retail)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 25,
      protocolVersion: 6,
      isRetail: 1,
      isPreview: 0
    },
    {
      guid: 'cb8fc780-2c05-495a-9710-85afffc904d7',
      name: 'Windows 8.1 (Volume)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 25,
      protocolVersion: 6,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '5f94a0bb-d5a0-4081-a685-5819418b2fe0',
      name: 'Windows Preview',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 25,
      protocolVersion: 5,
      isRetail: 0,
      isPreview: 1
    },
    {
      guid: '33e156e4-b76f-4a52-9f91-f641dd95ac48',
      name: 'Windows Server 2008 A (Web and HPC)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 5,
      protocolVersion: 4,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '8fe53387-3087-4447-8985-f75132215ac9',
      name: 'Windows Server 2008 B (Standard and Enterprise)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 5,
      protocolVersion: 4,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '8a21fdf3-cbc5-44eb-83f3-fe284e6680a7',
      name: 'Windows Server 2008 C (Datacenter)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 5,
      protocolVersion: 4,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '0fc6ccaf-ff0e-4fae-9d08-4370785bf7ed',
      name: 'Windows Server 2008 R2 A (Web and HPC)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 5,
      protocolVersion: 4,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: 'ca87f5b6-cd46-40c0-b06d-8ecd57a4373f',
      name: 'Windows Server 2008 R2 B (Standard and Enterprise)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 5,
      protocolVersion: 4,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: 'b2ca2689-a9a8-42d7-938d-cf8e9f201958',
      name: 'Windows Server 2008 R2 C (Datacenter)',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 5,
      protocolVersion: 4,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '8665cb71-468c-4aa3-a337-cb9bc9d5eaac',
      name: 'Windows Server 2012',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 5,
      protocolVersion: 5,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '8456efd3-0c04-4089-8740-5b7238535a65',
      name: 'Windows Server 2012 R2',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 5,
      protocolVersion: 6,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '6e9fc069-257d-4bc4-b4a7-750514d32743',
      name: 'Windows Server 2016',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 5,
      protocolVersion: 6,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '6d5f5270-31ac-433e-b90a-39892923c657',
      name: 'Windows Server Preview',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 5,
      protocolVersion: 6,
      isRetail: 0,
      isPreview: 1
    },
    {
      guid: '212a64dc-43b1-4d3d-a30c-2fc69d2095c6',
      name: 'Windows Vista',
      appIndex: 0,
      ePidIndex: 0,
      nCountPolicy: 25,
      protocolVersion: 4,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: 'e85af946-2e25-47b7-83e1-bebcebeac611',
      name: 'Office 2010',
      appIndex: 1,
      ePidIndex: 1,
      nCountPolicy: 5,
      protocolVersion: 4,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: 'e6a6f1bf-9d40-40c3-aa9f-c77ba21578c0',
      name: 'Office 2013',
      appIndex: 2,
      ePidIndex: 2,
      nCountPolicy: 5,
      protocolVersion: 5,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: 'aa4c7968-b9da-4680-92b6-acb25e2f866c',
      name: 'Office 2013 (Pre-Release)',
      appIndex: 2,
      ePidIndex: 0,
      nCountPolicy: 5,
      protocolVersion: 5,
      isRetail: 0,
      isPreview: 1
    },
    {
      guid: '85b5f61b-320b-4be3-814a-b76b2bfafc82',
      name: 'Office 2016',
      appIndex: 2,
      ePidIndex: 3,
      nCountPolicy: 5,
      protocolVersion: 6,
      isRetail: 0,
      isPreview: 0
    },
    {
      guid: '617d9eb1-ef36-4f82-86e0-a65ae07b96c6',
      name: 'Office 2019',
      appIndex: 2,
      ePidIndex: 5,
      nCountPolicy: 5,
      protocolVersion: 6,
      isRetail: 0,
      isPreview: 0
    }
  ],
  skuItems: [
    {
      guid: '8de8eb62-bbe0-40ac-ac17-f75595071ea3',
      name: 'Windows Server 2019 ARM64',
      appIndex: 0,
      kmsIndex: 0,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'a99cc1f0-7719-4306-9645-294102fbff95',
      name: 'Windows Server 2019 Azure Core',
      appIndex: 0,
      kmsIndex: 0,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '34e1ae55-27f8-4950-8877-7a03be5fb181',
      name: 'Windows Server 2019 Datacenter',
      appIndex: 0,
      kmsIndex: 0,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '034d3cbb-5d4b-4245-b3f8-f84571314078',
      name: 'Windows Server 2019 Essentials',
      appIndex: 0,
      kmsIndex: 0,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'de32eafd-aaee-4662-9444-c1befb41bde2',
      name: 'Windows Server 2019 Standard',
      appIndex: 0,
      kmsIndex: 0,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '90c362e5-0da1-4bfd-b53b-b87d309ade43',
      name: 'Windows Server 2019 Datacenter (Semi-Annual Channel)',
      appIndex: 0,
      kmsIndex: 0,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '73e3957c-fc0c-400d-9184-5f7b6f2eb409',
      name: 'Windows Server 2019 Standard (Semi-Annual Channel)',
      appIndex: 0,
      kmsIndex: 0,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '32d2fab3-e4a8-42c2-923b-4bf4fd13e6ee',
      name: 'Windows 10 Enterprise LTSC 2019',
      appIndex: 0,
      kmsIndex: 1,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '7103a333-b8c8-49cc-93ce-d37c09687f92',
      name: 'Windows 10 Enterprise LTSC 2019 N',
      appIndex: 0,
      kmsIndex: 1,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'e0b2d383-d112-413f-8a80-97f373a5820c',
      name: 'Windows 10 Enterprise G',
      appIndex: 0,
      kmsIndex: 3,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 4
    },
    {
      guid: 'e38454fb-41a4-4f59-a5dc-25080e354730',
      name: 'Windows 10 Enterprise GN',
      appIndex: 0,
      kmsIndex: 3,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 4
    },
    {
      guid: '2d5a5a60-3040-48bf-beb0-fcd770c20ce0',
      name: 'Windows 10 Enterprise 2016 LTSB',
      appIndex: 0,
      kmsIndex: 4,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '9f776d83-7156-45b2-8a5c-359b9c9f22a3',
      name: 'Windows 10 Enterprise 2016 LTSB N',
      appIndex: 0,
      kmsIndex: 4,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '58e97c99-f377-4ef1-81d5-4ad5522b5fd8',
      name: 'Windows 10 Home',
      appIndex: 0,
      kmsIndex: 5,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'a9107544-f4a0-4053-a96a-1479abdef912',
      name: 'Windows 10 Home Country Specific',
      appIndex: 0,
      kmsIndex: 5,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '7b9e1751-a8da-4f75-9560-5fadfe3d8e38',
      name: 'Windows 10 Home N',
      appIndex: 0,
      kmsIndex: 5,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'cd918a57-a41b-4c82-8dce-1a538e221a83',
      name: 'Windows 10 Home Single Language',
      appIndex: 0,
      kmsIndex: 5,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'e0c42288-980c-4788-a014-c080d2e1926e',
      name: 'Windows 10 Education',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '3c102355-d027-42c6-ad23-2e7ef8a02585',
      name: 'Windows 10 Education N',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '73111121-5638-40f6-bc11-f1d7b0d64300',
      name: 'Windows 10 Enterprise',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '7b51a46c-0c04-4e8f-9af4-8496cca90d5e',
      name: 'Windows 10 Enterprise 2015 LTSB',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '87b838b7-41b6-4590-8318-5797951d8529',
      name: 'Windows 10 Enterprise 2015 LTSB N',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'e272e3e2-732f-4c65-a8f0-484747d0d947',
      name: 'Windows 10 Enterprise N',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '82bbc092-bc50-4e16-8e18-b74fc486aec3',
      name: 'Windows 10 Professional Workstation',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '4b1571d3-bafb-4b40-8087-a961be2caf65',
      name: 'Windows 10 Professional Workstation N',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '2de67392-b7a7-462a-b1ca-108dd189f588',
      name: 'Windows 10 Professional',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '3f1afc82-f8ac-4f6c-8005-1d233e606eee',
      name: 'Windows 10 Professional Education',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '5300b18c-2e33-4dc2-8291-47ffcec746dd',
      name: 'Windows 10 Professional Education N',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'a80b5abf-76ad-428b-b05d-a47d2dffeebf',
      name: 'Windows 10 Professional N',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'ff808201-fec6-4fd4-ae16-abbddade5706',
      name: 'Windows 10 Professional Preview',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '43f2ab05-7c87-4d56-b27c-44d0f9a3dabd',
      name: 'Windows 10 Enterprise Preview',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'ec868e65-fadf-4759-b23e-93fe37f2cc29',
      name: 'Windows 10 Enterprise for Virtual Desktops',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'e4db50ea-bda1-4566-b047-0ca50abc6f07',
      name: 'Windows 10 Remote Server',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '0df4f814-3f57-4b8b-9a9d-fddadcd69fac',
      name: 'Windows 10 S (Lean)',
      appIndex: 0,
      kmsIndex: 6,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'ae2ee509-1b34-41c0-acb7-6d4650168915',
      name: 'Windows 7 Enterprise',
      appIndex: 0,
      kmsIndex: 7,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '46bbed08-9c7b-48fc-a614-95250573f4ea',
      name: 'Windows 7 Enterprise E',
      appIndex: 0,
      kmsIndex: 7,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '1cb6d605-11b3-4e14-bb30-da91c8e3983a',
      name: 'Windows 7 Enterprise N',
      appIndex: 0,
      kmsIndex: 7,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'b92e9980-b9d5-4821-9c94-140f632f6312',
      name: 'Windows 7 Professional',
      appIndex: 0,
      kmsIndex: 7,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '5a041529-fef8-4d07-b06f-b59b573b32d2',
      name: 'Windows 7 Professional E',
      appIndex: 0,
      kmsIndex: 7,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '54a09a0d-d57b-4c10-8b69-a842d6590ad5',
      name: 'Windows 7 Professional N',
      appIndex: 0,
      kmsIndex: 7,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'db537896-376f-48ae-a492-53d0547773d0',
      name: 'Windows 7 Embedded POSReady',
      appIndex: 0,
      kmsIndex: 7,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'e1a8296a-db37-44d1-8cce-7bc961d59c54',
      name: 'Windows 7 Embedded Standard',
      appIndex: 0,
      kmsIndex: 7,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'aa6dd3aa-c2b4-40e2-a544-a6bbb3f5c395',
      name: 'Windows 7 ThinPC',
      appIndex: 0,
      kmsIndex: 7,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'c04ed6bf-55c8-4b47-9f8e-5a1f31ceee60',
      name: 'Windows 8 Core',
      appIndex: 0,
      kmsIndex: 8,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '9d5584a2-2d85-419a-982c-a00888bb9ddf',
      name: 'Windows 8 Core Country Specific',
      appIndex: 0,
      kmsIndex: 8,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '197390a0-65f6-4a95-bdc4-55d58a3b0253',
      name: 'Windows 8 Core N',
      appIndex: 0,
      kmsIndex: 8,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '8860fcd4-a77b-4a20-9045-a150ff11d609',
      name: 'Windows 8 Core Single Language',
      appIndex: 0,
      kmsIndex: 8,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'a00018a3-f20f-4632-bf7c-8daa5351c914',
      name: 'Windows 8 Professional WMC',
      appIndex: 0,
      kmsIndex: 8,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '10018baf-ce21-4060-80bd-47fe74ed4dab',
      name: 'Windows 8 Embedded Industry Professional',
      appIndex: 0,
      kmsIndex: 9,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '18db1848-12e0-4167-b9d7-da7fcda507db',
      name: 'Windows 8 Embedded Industry Enterprise',
      appIndex: 0,
      kmsIndex: 9,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '458e1bec-837a-45f6-b9d5-925ed5d299de',
      name: 'Windows 8 Enterprise',
      appIndex: 0,
      kmsIndex: 9,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'e14997e7-800a-4cf7-ad10-de4b45b578db',
      name: 'Windows 8 Enterprise N',
      appIndex: 0,
      kmsIndex: 9,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'a98bcd6d-5343-4603-8afe-5908e4611112',
      name: 'Windows 8 Professional',
      appIndex: 0,
      kmsIndex: 9,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'ebf245c1-29a8-4daf-9cb1-38dfc608a8c8',
      name: 'Windows 8 Professional N',
      appIndex: 0,
      kmsIndex: 9,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'fe1c3238-432a-43a1-8e25-97e7d1ef10f3',
      name: 'Windows 8.1 Core',
      appIndex: 0,
      kmsIndex: 10,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'ffee456a-cd87-4390-8e07-16146c672fd0',
      name: 'Windows 8.1 Core ARM',
      appIndex: 0,
      kmsIndex: 10,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'db78b74f-ef1c-4892-abfe-1e66b8231df6',
      name: 'Windows 8.1 Core Country Specific',
      appIndex: 0,
      kmsIndex: 10,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '78558a64-dc19-43fe-a0d0-8075b2a370a3',
      name: 'Windows 8.1 Core N',
      appIndex: 0,
      kmsIndex: 10,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'c72c6a1d-f252-4e7e-bdd1-3fca342acb35',
      name: 'Windows 8.1 Core Single Language',
      appIndex: 0,
      kmsIndex: 10,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'e58d87b5-8126-4580-80fb-861b22f79296',
      name: 'Windows 8.1 Professional Student',
      appIndex: 0,
      kmsIndex: 10,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'cab491c7-a918-4f60-b502-dab75e334f40',
      name: 'Windows 8.1 Professional Student N',
      appIndex: 0,
      kmsIndex: 10,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '096ce63d-4fac-48a9-82a9-61ae9e800e5f',
      name: 'Windows 8.1 Professional WMC',
      appIndex: 0,
      kmsIndex: 10,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 1,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'e9942b32-2e55-4197-b0bd-5ff58cba8860',
      name: 'Windows 8.1 Core Connected',
      appIndex: 0,
      kmsIndex: 11,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'ba998212-460a-44db-bfb5-71bf09d1c68b',
      name: 'Windows 8.1 Core Connected Country Specific',
      appIndex: 0,
      kmsIndex: 11,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'c6ddecd6-2354-4c19-909b-306a3058484e',
      name: 'Windows 8.1 Core Connected N',
      appIndex: 0,
      kmsIndex: 11,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'b8f5e3a3-ed33-4608-81e1-37d6c9dcfd9c',
      name: 'Windows 8.1 Core Connected Single Language',
      appIndex: 0,
      kmsIndex: 11,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '81671aaf-79d1-4eb1-b004-8cbbe173afea',
      name: 'Windows 8.1 Enterprise',
      appIndex: 0,
      kmsIndex: 11,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '113e705c-fa49-48a4-beea-7dd879b46b14',
      name: 'Windows 8.1 Enterprise N',
      appIndex: 0,
      kmsIndex: 11,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'c06b6981-d7fd-4a35-b7b4-054742b7af67',
      name: 'Windows 8.1 Professional',
      appIndex: 0,
      kmsIndex: 11,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '7476d79f-8e48-49b4-ab63-4d0b813a16e4',
      name: 'Windows 8.1 Professional N',
      appIndex: 0,
      kmsIndex: 11,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '0ab82d54-47f4-4acb-818c-cc5bf0ecb649',
      name: 'Windows 8.1 Embedded Industry Professional',
      appIndex: 0,
      kmsIndex: 11,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'f7e88590-dfc7-4c78-bccb-6f3865b99d1a',
      name: 'Windows 8.1 Embedded Industry Automotive',
      appIndex: 0,
      kmsIndex: 11,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'cd4e2d9f-5059-4a50-a92d-05d5bb1267c7',
      name: 'Windows 8.1 Embedded Industry Enterprise',
      appIndex: 0,
      kmsIndex: 11,
      protocolVersion: 6,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'cde952c7-2f96-4d9d-8f2b-2d349f64fc51',
      name: 'Windows 10 Enterprise Preview',
      appIndex: 0,
      kmsIndex: 12,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: 'a4383e6b-dada-423d-a43d-f25678429676',
      name: 'Windows 10 Professional Preview',
      appIndex: 0,
      kmsIndex: 12,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: 'cf59a07b-1a2a-4be0-bfe0-423b5823e663',
      name: 'Windows 10 Professional WMC Preview',
      appIndex: 0,
      kmsIndex: 12,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '2b9c337f-7a1d-4271-90a3-c6855a2b8a1c',
      name: 'Windows 8.x Preview',
      appIndex: 0,
      kmsIndex: 12,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '631ead72-a8ab-4df8-bbdf-372029989bdd',
      name: 'Windows 8.x Preview ARM',
      appIndex: 0,
      kmsIndex: 12,
      protocolVersion: 5,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: 'ddfa9f7c-f09e-40b9-8c1a-be877a9a7f4b',
      name: 'Windows Server 2008 Web',
      appIndex: 0,
      kmsIndex: 13,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '7afb1156-2c1d-40fc-b260-aab7442b62fe',
      name: 'Windows Server 2008 Compute Cluster',
      appIndex: 0,
      kmsIndex: 13,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'ad2542d4-9154-4c6d-8a44-30f11ee96989',
      name: 'Windows Server 2008 Standard',
      appIndex: 0,
      kmsIndex: 14,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '2401e3d0-c50a-4b58-87b2-7e794b7d2607',
      name: 'Windows Server 2008 Standard without Hyper-V',
      appIndex: 0,
      kmsIndex: 14,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'c1af4d90-d1bc-44ca-85d4-003ba33db3b9',
      name: 'Windows Server 2008 Enterprise',
      appIndex: 0,
      kmsIndex: 14,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '8198490a-add0-47b2-b3ba-316b12d647b4',
      name: 'Windows Server 2008 Enterprise without Hyper-V',
      appIndex: 0,
      kmsIndex: 14,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '68b6e220-cf09-466b-92d3-45cd964b9509',
      name: 'Windows Server 2008 Datacenter',
      appIndex: 0,
      kmsIndex: 15,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'fd09ef77-5647-4eff-809c-af2b64659a45',
      name: 'Windows Server 2008 Datacenter without Hyper-V',
      appIndex: 0,
      kmsIndex: 15,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '01ef176b-3e0d-422a-b4f8-4ea880035e8f',
      name: 'Windows Server 2008 for Itanium',
      appIndex: 0,
      kmsIndex: 15,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'f772515c-0e87-48d5-a676-e6962c3e1195',
      name: 'Windows MultiPoint Server 2010',
      appIndex: 0,
      kmsIndex: 16,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'a78b8bd9-8017-4df5-b86a-09f756affa7c',
      name: 'Windows Server 2008 R2 Web',
      appIndex: 0,
      kmsIndex: 16,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'cda18cf3-c196-46ad-b289-60c072869994',
      name: 'Windows Server 2008 R2 HPC Edition',
      appIndex: 0,
      kmsIndex: 16,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '68531fb9-5511-4989-97be-d11a0f55633f',
      name: 'Windows Server 2008 R2 Standard',
      appIndex: 0,
      kmsIndex: 17,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '620e2b3d-09e7-42fd-802a-17a13652fe7a',
      name: 'Windows Server 2008 R2 Enterprise',
      appIndex: 0,
      kmsIndex: 17,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '7482e61b-c589-4b7f-8ecc-46d455ac3b87',
      name: 'Windows Server 2008 R2 Datacenter',
      appIndex: 0,
      kmsIndex: 18,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '8a26851c-1c7e-48d3-a687-fbca9b9ac16b',
      name: 'Windows Server 2008 R2 for Itanium Enterprise',
      appIndex: 0,
      kmsIndex: 18,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'd3643d60-0c42-412d-a7d6-52e6635327f6',
      name: 'Windows Server 2012 Datacenter',
      appIndex: 0,
      kmsIndex: 19,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '95fd1c83-7df5-494a-be8b-1300e1c9d1cd',
      name: 'Windows Server 2012 MultiPoint Premium',
      appIndex: 0,
      kmsIndex: 19,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '7d5486c7-e120-4771-b7f1-7b56c6d3170c',
      name: 'Windows Server 2012 MultiPoint Standard',
      appIndex: 0,
      kmsIndex: 19,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'f0f5ec41-0d55-4732-af02-440a44a3cf0f',
      name: 'Windows Server 2012 Standard',
      appIndex: 0,
      kmsIndex: 19,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'b743a2be-68d4-4dd3-af32-92425b7bb623',
      name: 'Windows Server 2012 R2 Cloud Storage',
      appIndex: 0,
      kmsIndex: 20,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '00091344-1ea4-4f37-b789-01750ba6988c',
      name: 'Windows Server 2012 R2 Datacenter',
      appIndex: 0,
      kmsIndex: 20,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '21db6ba4-9a7b-4a14-9e29-64a60c59301d',
      name: 'Windows Server 2012 R2 Essentials',
      appIndex: 0,
      kmsIndex: 20,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'b3ca044e-a358-4d68-9883-aaa2941aca99',
      name: 'Windows Server 2012 R2 Standard',
      appIndex: 0,
      kmsIndex: 20,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '3dbf341b-5f6c-4fa7-b936-699dce9e263f',
      name: 'Windows Server 2016 Azure Core',
      appIndex: 0,
      kmsIndex: 21,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '7b4433f4-b1e7-4788-895a-c45378d38253',
      name: 'Windows Server 2016 Cloud Storage',
      appIndex: 0,
      kmsIndex: 21,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '21c56779-b449-4d20-adfc-eece0e1ad74b',
      name: 'Windows Server 2016 Datacenter',
      appIndex: 0,
      kmsIndex: 21,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '2b5a1b0f-a5ab-4c54-ac2f-a6d94824a283',
      name: 'Windows Server 2016 Essentials',
      appIndex: 0,
      kmsIndex: 21,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '8c1c5410-9f39-4805-8c9d-63a07706358f',
      name: 'Windows Server 2016 Standard',
      appIndex: 0,
      kmsIndex: 21,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '43d9af6e-5e86-4be8-a797-d072a046896c',
      name: 'Windows Server 2016 ARM64',
      appIndex: 0,
      kmsIndex: 21,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'e49c08e7-da82-42f8-bde2-b570fbcae76c',
      name: 'Windows Server 2016 Datacenter (Semi-Annual Channel)',
      appIndex: 0,
      kmsIndex: 21,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '61c5ef22-f14f-4553-a824-c4b31e84b100',
      name: 'Windows Server 2016 Standard (Semi-Annual Channel)',
      appIndex: 0,
      kmsIndex: 21,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'ba947c44-d19d-4786-b6ae-22770bc94c54',
      name: 'Windows Server 2016 Datacenter Preview',
      appIndex: 0,
      kmsIndex: 22,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '4f3d1606-3fea-4c01-be3c-8d671c401e3b',
      name: 'Windows Vista Business',
      appIndex: 0,
      kmsIndex: 23,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '2c682dc2-8b68-4f63-a165-ae291d4cf138',
      name: 'Windows Vista Business N',
      appIndex: 0,
      kmsIndex: 23,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'cfd8ff08-c0d7-452b-9f60-ef5c70c32094',
      name: 'Windows Vista Enterprise',
      appIndex: 0,
      kmsIndex: 23,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: 'd4f54950-26f2-4fb4-ba21-ffab16afcade',
      name: 'Windows Vista Enterprise N',
      appIndex: 0,
      kmsIndex: 23,
      protocolVersion: 4,
      nCountPolicy: 25,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 0
    },
    {
      guid: '8ce7e872-188c-4b98-9d90-f8f90b7aad02',
      name: 'Office Access 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: 'cee5d470-6e3b-4fcc-8c2b-d17428568a9f',
      name: 'Office Excel 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: '8947d0b8-c33b-43e1-8c56-9b674c052832',
      name: 'Office Groove 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: 'ca6b6639-4ad6-40ae-a575-14dee07f6430',
      name: 'Office InfoPath 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: '09ed9640-f020-400a-acd8-d7d867dfd9c2',
      name: 'Office Mondo 1 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: 'ef3d4e49-a53d-4d81-a2b1-2ca6c2556b2c',
      name: 'Office Mondo 2 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: 'ab586f5c-5256-4632-962f-fefd8b49e6f4',
      name: 'Office OneNote 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: 'ecb7c192-73ab-4ded-acf4-2399b095d0cc',
      name: 'Office OutLook 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: '45593b1d-dfb1-4e91-bbfb-2d5d0ce2227a',
      name: 'Office PowerPoint 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: '6f327760-8c5c-417c-9b61-836a98287e0c',
      name: 'Office Professional Plus 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: 'df133ff7-bf14-4f95-afe3-7b48e7e331ef',
      name: 'Office Project Pro 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: '5dc7bf61-5ec9-4996-9ccb-df806a2d0efe',
      name: 'Office Project Standard 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: 'b50c4f75-599b-43e8-8dcd-1081a7967241',
      name: 'Office Publisher 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: 'ea509e87-07a1-4a45-9edc-eba5a39f36af',
      name: 'Office Small Business Basics 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: '9da2a678-fb6b-4e67-ab84-60dd6a9c819a',
      name: 'Office Standard 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: '92236105-bb67-494f-94c7-7f7a607929bd',
      name: 'Office Visio Premium 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: 'e558389c-83c3-4b29-adfe-5e4d7f46c358',
      name: 'Office Visio Pro 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: '9ed833ff-4f92-4f36-b370-8683a4f13275',
      name: 'Office Visio Standard 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: '2d0882e7-a4e7-423b-8ccc-70d91e0158b1',
      name: 'Office Word 2010',
      appIndex: 1,
      kmsIndex: 24,
      protocolVersion: 4,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 1
    },
    {
      guid: '6ee7622c-18d8-4005-9fb7-92db644a279b',
      name: 'Office Access 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: 'f7461d52-7c2b-43b2-8744-ea958e0bd09a',
      name: 'Office Excel 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: 'a30b8040-d68a-423f-b0b5-9ce292ea5a8f',
      name: 'Office InfoPath 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: '1b9f11e3-c85c-4e1b-bb29-879ad2c909e3',
      name: 'Office Lync 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: 'dc981c6b-fc8e-420f-aa43-f8f33e5c0923',
      name: 'Office Mondo 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: 'efe1f3e6-aea2-4144-a208-32aa872b6545',
      name: 'Office OneNote 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: '771c3afa-50c5-443f-b151-ff2546d863a0',
      name: 'Office OutLook 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: '8c762649-97d1-4953-ad27-b7e2c25b972e',
      name: 'Office PowerPoint 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: 'b322da9c-a2e2-4058-9e4e-f59a6970bd69',
      name: 'Office Professional Plus 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: '4a5d124a-e620-44ba-b6ff-658961b33b9a',
      name: 'Office Project Pro 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: '427a28d1-d17c-4abf-b717-32c780ba6f07',
      name: 'Office Project Standard 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: '00c79ff1-6850-443d-bf61-71cde0de305f',
      name: 'Office Publisher 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: 'b13afb38-cd79-4ae5-9f7f-eed058d750ca',
      name: 'Office Standard 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: 'e13ac10e-75d0-4aff-a0cd-764982cf541c',
      name: 'Office Visio Pro 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: 'ac4efaf0-f81f-4f61-bdf7-ea32b02ab117',
      name: 'Office Visio Standard 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: 'd9f5b1c6-5386-495a-88f9-9ad6b41ac9b3',
      name: 'Office Word 2013',
      appIndex: 2,
      kmsIndex: 25,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 2
    },
    {
      guid: '44b538e2-fb34-4732-81e4-644c17d2e746',
      name: 'Office Access 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '9373bfa0-97b3-4587-ab73-30934461d55c',
      name: 'Office Excel 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: 'aa286eb4-556f-4eeb-967c-c1b771b7673e',
      name: 'Office Groove 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '7ccc8256-fbaa-49c6-b2a9-f5afb4257cd2',
      name: 'Office InfoPath 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: 'c53dfe17-cc00-4967-b188-a088a965494d',
      name: 'Office Lync 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '2816a87d-e1ed-4097-b311-e2341c57b179',
      name: 'Office Mondo 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '67c0f908-184f-4f64-8250-12db797ab3c3',
      name: 'Office OneNote 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '7bce4e7a-dd80-4682-98fa-f993725803d2',
      name: 'Office Outlook 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '1ec10c0a-54f6-453e-b85a-6fa1bbfea9b7',
      name: 'Office PowerPoint 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '87d2b5bf-d47b-41fb-af62-71c382f5cc85',
      name: 'Office Professional Plus 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '3cfe50a9-0e03-4b29-9754-9f193f07b71f',
      name: 'Office Project Pro 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '39e49e57-ae68-4ee3-b098-26480df3da96',
      name: 'Office Project Standard 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '15aa2117-8f79-49a8-8317-753026d6a054',
      name: 'Office Publisher 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: 'cfbfd60e-0b5f-427d-917c-a4df42a80e44',
      name: 'Office Visio Pro 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '7012cc81-8887-42e9-b17d-4e5e42760f0d',
      name: 'Office Visio Standard 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: 'de9c7eb6-5a85-420d-9703-fff11bdd4d43',
      name: 'Office Word 2013 (Pre-Release)',
      appIndex: 2,
      kmsIndex: 26,
      protocolVersion: 5,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 1,
      ePidIndex: 0
    },
    {
      guid: '67c0fc0c-deba-401b-bf8b-9c8ad8395804',
      name: 'Office Access 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'c3e65d36-141f-4d2f-a303-a842ee756a29',
      name: 'Office Excel 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: '9caabccb-61b1-4b4b-8bec-d10a3c3ac2ce',
      name: 'Office Mondo 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'e914ea6e-a5fa-4439-a394-a9bb3293ca09',
      name: 'Office Mondo R 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'd8cace59-33d2-4ac7-9b1b-9b72339c51c8',
      name: 'Office OneNote 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'ec9d9265-9d1e-4ed0-838a-cdc20f2551a1',
      name: 'Office Outlook 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'd70b1bba-b893-4544-96e2-b7a318091c33',
      name: 'Office Powerpoint 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'd450596f-894d-49e0-966a-fd39ed4c4c64',
      name: 'Office Professional Plus 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: '4f414197-0fc2-4c01-b68a-86cbb9ac254c',
      name: 'Office Project Pro 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: '829b8110-0e6f-4349-bca4-42803577788d',
      name: 'Office Project Pro 2016 C2R',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'da7ddabc-3fbe-4447-9e01-6ab7440b4cd4',
      name: 'Office Project Standard 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'cbbaca45-556a-4416-ad03-bda598eaa7c8',
      name: 'Office Project Standard 2016 C2R',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: '041a06cb-c5b8-4772-809f-416d03d16654',
      name: 'Office Publisher 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: '83e04ee1-fa8d-436d-8994-d31a862cab77',
      name: 'Office Skype for Business 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'dedfa23d-6ed1-45a6-85dc-63cae0546de6',
      name: 'Office Standard 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: '6bf301c1-b94a-43e9-ba31-d494598c47fb',
      name: 'Office Visio Pro 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'b234abe3-0857-4f9c-b05a-4dc314f85557',
      name: 'Office Visio Pro 2016 C2R',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'aa2a7821-1827-4c2c-8f1d-4513a34dda97',
      name: 'Office Visio Standard 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: '361fe620-64f4-41b5-ba77-84f8e079b1f7',
      name: 'Office Visio Standard 2016 C2R',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'bb11badf-d8aa-470e-9311-20eaf80fe5cc',
      name: 'Office Word 2016',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: '0bc88885-718c-491d-921f-6f214349e79c',
      name: 'Office Professional Plus 2019 C2R Preview',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: 'fc7c4d0c-2e85-4bb9-afd4-01ed1476b5e9',
      name: 'Office Project Pro 2019 C2R Preview',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: '500f6619-ef93-4b75-bcb4-82819998a3ca',
      name: 'Office Visio Pro 2019 C2R Preview',
      appIndex: 2,
      kmsIndex: 27,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 3
    },
    {
      guid: '9e9bceeb-e736-4f26-88de-763f87dcc485',
      name: 'Office Access 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    },
    {
      guid: '237854e9-79fc-4497-a0c1-a70969691c6b',
      name: 'Office Excel 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    },
    {
      guid: 'c8f8a301-19f5-4132-96ce-2de9d4adbd33',
      name: 'Office Outlook 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    },
    {
      guid: '3131fd61-5e4f-4308-8d6d-62be1987c92c',
      name: 'Office Powerpoint 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    },
    {
      guid: '85dd8b5f-eaa4-4af3-a628-cce9e77c9a03',
      name: 'Office Professional Plus 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    },
    {
      guid: '2ca2bf3f-949e-446a-82c7-e25a15ec78c4',
      name: 'Office Project Pro 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    },
    {
      guid: '1777f0e3-7392-4198-97ea-8ae4de6f6381',
      name: 'Office Project Standard 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    },
    {
      guid: '9d3e4cca-e172-46f1-a2f4-1d2107051444',
      name: 'Office Publisher 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    },
    {
      guid: '734c6c6e-b0ba-4298-a891-671772b2bd1b',
      name: 'Office Skype for Business 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    },
    {
      guid: '6912a74b-a5fb-401a-bfdb-2e3ab46f4b02',
      name: 'Office Standard 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    },
    {
      guid: '5b5cf08f-b81a-431d-b080-3450d8620565',
      name: 'Office Visio Pro 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    },
    {
      guid: 'e06d7df3-aad0-419d-8dfb-0ac37e2bdf39',
      name: 'Office Visio Standard 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    },
    {
      guid: '059834fe-a8ea-4bff-b67b-4d006b5447d3',
      name: 'Office Word 2019',
      appIndex: 2,
      kmsIndex: 28,
      protocolVersion: 6,
      nCountPolicy: 5,
      isRetail: 0,
      isPreview: 0,
      ePidIndex: 5
    }
  ],
  hostBuilds: [
    {
      buildNumber: 17763,
      platformId: 3612,
      displayName: 'Windows 10 1809 / Server 2019',
      flags: 7,
      releaseDate: 1538438400
    },
    {
      buildNumber: 14393,
      platformId: 3612,
      displayName: 'Windows 10 1607 / Server 2016',
      flags: 7,
      releaseDate: 1470096000
    },
    {
      buildNumber: 9600,
      platformId: 6401,
      displayName: 'Windows 8.1 / Server 2012 R2',
      flags: 7,
      releaseDate: 1382054400
    },
    {
      buildNumber: 9200,
      platformId: 5426,
      displayName: 'Windows 8 / Server 2012',
      flags: 7,
      releaseDate: 1351209600
    },
    {
      buildNumber: 7601,
      platformId: 55041,
      displayName: 'Windows 7 / Server 2008 R2 SP1',
      flags: 6,
      releaseDate: 1298332800
    },
    {
      buildNumber: 6002,
      platformId: 55041,
      displayName: 'Windows Vista / Server 2008 SP2',
      flags: 6,
      releaseDate: 1243296000
    }
  ]
}

// ─── 数据查询工具函数 ──────────────────────────────────────────────────────

/**
 * 按 GUID 查找产品索引（不区分大小写）
 * 参考: src/vlmcs.c 中的产品查找逻辑
 *
 * @param guid  要查找的 GUID 字符串
 * @param list  产品列表
 * @param count 列表长度
 * @returns 匹配的索引，未找到返回 -1
 */
export function getProductIndex(
  guid: string,
  list: ReadonlyArray<{ guid: string }>,
  count: number
): number {
  const needle = guid.toLowerCase()
  for (let i = 0; i < count && i < list.length; i++) {
    if (list[i].guid.toLowerCase() === needle) return i
  }
  return -1
}

/**
 * 按名称查找许可证包 (SKU)，支持部分匹配（不区分大小写）
 * 参考: src/vlmcs.c 中 -l 参数的处理逻辑
 *
 * @param name 要查找的产品名称（可以是部分名称）
 * @returns 匹配的 SkuItem，未找到返回 undefined
 */
export function findLicensePackByName(name: string): SkuItem | undefined {
  const needle = name.toLowerCase()
  return KmsData.skuItems.find(sku => sku.name.toLowerCase().includes(needle))
}
