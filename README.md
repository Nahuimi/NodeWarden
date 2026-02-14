# NodeWarden
English：[`README_EN.md`](./README_EN.md)

运行在 **Cloudflare Workers** 上的 **Bitwarden 第三方服务端**。

> **免责声明**  
> 本项目仅供学习交流使用。我们不对任何数据丢失负责，强烈建议定期备份您的密码库。  
> 本项目与 Bitwarden 官方无关，请勿向 Bitwarden 官方反馈问题。

---

## 特性
- ✅ **完全免费，不需要在服务器上部署，再次感谢大善人！**
- ✅ 数据存储基于 Cloudflare D1（SQLite）
- ✅ 完整的密码、笔记、卡片、身份信息管理
- ✅ 文件夹和收藏功能
- ✅ 文件附件支持（基于 R2 存储）
- ✅ 导入/导出功能
- ✅ 网站图标获取
- ✅ 端到端加密（服务器无法查看明文）
- ✅ 无感更新，零停机

## 测试情况：
- ✅ Windows 客户端（v2026.1.0）
- ✅ Android App（v2026.1.0）
- ✅ 浏览器扩展（v2026.1.0）
- ⬜ macOS 客户端（未测试）
- ⬜ Linux 客户端（未测试）
---

# 快速开始

### 一键部署

**部署步骤：**

1. 先在右上角fork此项目（若后续不需要更新，可不fork）
2. [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/shuaiplus/nodewarden)
3. 打开部署后生成的链接，并根据网页提示完成后续操作。

---

## 本地开发

这是一个 Cloudflare Workers 的 TypeScript 项目（Wrangler）。

```bash
npm install
npm run dev
```

---

## 常见问题

**Q: 如何备份数据？**  
A: 在客户端中选择「导出密码库」，保存 JSON 文件。

**Q: 忘记主密码怎么办？**  
A: 无法恢复，这是端到端加密的特性。建议妥善保管主密码。

**Q: 可以多人使用吗？**  
A: 不建议。本项目为单用户设计，多人使用请选择 Vaultwarden。

---

## 开源协议

LGPL-3.0 License

---

## 致谢

- [Bitwarden](https://bitwarden.com/) - 原始设计和客户端
- [Vaultwarden](https://github.com/dani-garcia/vaultwarden) - 服务器实现参考
- [Cloudflare Workers](https://workers.cloudflare.com/) - 无服务器平台
