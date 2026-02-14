# Memblaze 企业级 SSD 规格管理系统

一个基于 Vite、Bootstrap 5 和 Supabase 构建的交互式仪表盘，用于管理和查看企业级 SSD 的详细规格参数。

## 功能特点

- **规格仪表盘**：查看全面的企业级 SSD 规格列表，包括系列、型号、容量、NAND 类型及 PCIe 5.0 性能参数。
- **高级筛选**：支持按系列、型号、容量、NAND 和外形尺寸（Form Factor）进行实时筛选。
- **管理员管理**：
  - 通过安全密码登录开启管理模式。
  - 新增 SSD 规格记录。
  - 编辑现有记录。
  - 从数据库中删除记录。
- **数据持久化**：使用 Supabase 作为后端数据库和 API。
- **数据初始化工具**：内置脚本，可根据 JSON 文件自动向数据库填充数据。

## 技术栈

- **前端**：Vite, JavaScript (ES modules), Bootstrap 5, Lucide Icons
- **后端**：Supabase (Database & API)
- **工具**：Node.js, dotenv

## 快速上手

### 环境准备

- Node.js (建议 v18 或更高版本)
- 一个 Supabase 账号及创建好的项目

### 安装步骤

1. 克隆仓库：
   ```bash
   git clone https://github.com/zhangtaile/memblaze-specs.git
   cd memblaze-specs
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 配置环境变量：
   在根目录下创建一个 `.env` 文件，并填写你的 Supabase 凭据：
   ```env
   VITE_SUPABASE_URL=你的_SUPABASE_项目_URL
   VITE_SUPABASE_ANON_KEY=你的_SUPABASE_匿名_KEY
   ```

### 数据库配置

1. 在 Supabase 的 SQL Editor 中运行 `supabase_schema.sql` 文件中的代码来创建 `ssd_specs` 数据表。
2. （可选）使用初始数据填充数据库：
   ```bash
   npm run seed
   ```

### 运行项目

启动开发服务器：
```bash
npm run dev
```

启动后，可通过浏览器访问 `http://localhost:5173`。

## 项目部署

执行以下命令进行生产环境构建：
```bash
npm run build
```
构建生成的文件将存放在 `dist` 目录中，可直接部署至 Vercel、Netlify 或 GitHub Pages。

## 许可证

私有项目 (Private)
