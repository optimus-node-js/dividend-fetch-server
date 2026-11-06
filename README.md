# dividend-fetch-server: Dividend Data REST API

> An Express + Cheerio microservice that scrapes declared dividends from Moneycontrol and serves them as JSON, deployed serverless on Vercel.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) ![Cheerio](https://img.shields.io/badge/Cheerio-E88C1F?style=flat-square) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

**Live:** [divident-fetch-server.vercel.app](https://divident-fetch-server.vercel.app)

## API

| Method | Endpoint | Response |
|---|---|---|
| `GET` | `/` | JSON array of the latest declared dividends (company, type, %, amount, announcement/record/ex-date) |

## Run locally

```bash
git clone https://github.com/optimus-node-js/dividend-fetch-server.git
cd dividend-fetch-server
```

```bash
npm install
node index.js
```

Deploys to Vercel as-is via `vercel.json`.

**Related:** [AlgoDividend](https://github.com/optimus-node-js/AlgoDividend) · [Dividend-Fetcher](https://github.com/optimus-node-js/Dividend-Fetcher)

---

## Author

**Rahul Vishwakarma**, Senior Full Stack Developer based in Ahmedabad, India

[![Portfolio](https://img.shields.io/badge/Portfolio-rahul--vishwakarma--portfolio.vercel.app-0A66C2?style=flat-square&logo=vercel&logoColor=white)](https://rahul-vishwakarma-portfolio.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Rahul%20Vishwakarma-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/rahul-vishwakarma-101346192)
[![Email](https://img.shields.io/badge/Email-karmarahul67%40gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:karmarahul67@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-optimus--node--js-181717?style=flat-square&logo=github)](https://github.com/optimus-node-js)

