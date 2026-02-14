# NodeWarden
中文文档：[`README.md`](./README.md)

A **Bitwarden-compatible** server that runs on **Cloudflare Workers**.

> Disclaimer
> - This project is for learning and communication only.
> - We are not responsible for any data loss. Regular vault backups are strongly recommended.
> - This project is not affiliated with Bitwarden. Please do not report issues to the official Bitwarden team.

---

## Features

- ✅ **Completely free, no server deployment needed. Thanks again to the generous sponsor!**
- ✅ Data storage on Cloudflare D1 (SQLite)
- ✅ Full support for logins, notes, cards, and identities
- ✅ Folders and favorites
- ✅ Attachments (Cloudflare R2)
- ✅ Import / export
- ✅ Website icons
- ✅ End-to-end encryption (the server can’t see plaintext)
- ✅ Compatible with common Bitwarden official clients

## Tested clients / platforms

- ✅ Windows desktop client (v2026.1.0)
- ✅ Android app (v2026.1.0)
- ✅ Browser extension (v2026.1.0)
- ⬜ macOS desktop client (not tested)
- ⬜ Linux desktop client (not tested)

---

# Quick start

### One-click deploy

**Deploy steps:**

1. [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/shuaiplus/nodewarden)
2. Open the generated service URL and follow the on-page instructions.


## Local development

This repo is a Cloudflare Workers TypeScript project (Wrangler).

```bash
npm install
npm run dev
```

---

## FAQ

**Q: How do I back up my data?**  
A: Use **Export vault** in your client and save the JSON file.

**Q: What if I forget the master password?**  
A: It can’t be recovered (end-to-end encryption). Keep it safe.

**Q: Can multiple people use it?**  
A: Not recommended. This project is designed for single-user usage. For multi-user usage, choose Vaultwarden.

---

## License

LGPL-3.0 License

---

## Credits

- [Bitwarden](https://bitwarden.com/) - original design and clients
- [Vaultwarden](https://github.com/dani-garcia/vaultwarden) - server implementation reference
- [Cloudflare Workers](https://workers.cloudflare.com/) - serverless platform