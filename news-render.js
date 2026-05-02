(async () => {
  const escapeHtml = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const fetchJson = async (path) => {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status}`);
    }
    return response.json();
  };

  const tagClass = (category) => {
    if (category === "財經") return "tag-finance";
    if (category === "台股") return "tag-stock";
    return "tag-tech";
  };

  const renderNewsCards = (items, fallback) => {
    if (!items || items.length === 0) {
      return `<div style="padding:28px;color:var(--muted);font-family:'Noto Serif TC',serif;">${escapeHtml(fallback)}</div>`;
    }

    return items
      .map(
        (item, index) => `
      <article class="card">
        <div class="card-number">${String(index + 1).padStart(2, "0")}</div>
        <span class="card-tag ${tagClass(item.category)}">${escapeHtml(item.category || "科技")}</span>
        <div class="card-headline">${escapeHtml(item.headline || "")}</div>
        <div class="card-summary">${escapeHtml(item.summary || "")}</div>
        <div class="card-meta">
          <span class="card-source">
            <a href="${escapeHtml(item.source_url || "#")}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${escapeHtml(item.source_name || "")}</a>
          </span>
          <span>${escapeHtml(item.published_time || "")}</span>
        </div>
      </article>
    `
      )
      .join("");
  };

  const renderCategoryItems = (items, fallback) => {
    if (!items || items.length === 0) {
      return `<div style="padding:32px;color:var(--muted);font-family:'Noto Serif TC',serif;">${escapeHtml(fallback)}</div>`;
    }

    return items
      .map(
        (item, index) => `
      <a class="news-item" href="${escapeHtml(item.source_url || "#")}" target="_blank" rel="noopener">
        <div class="item-date">${String(index + 1).padStart(2, "0")} · ${escapeHtml(item.published_time || "")}</div>
        <div>
          <div class="item-headline">${escapeHtml(item.headline || "")}</div>
          <div class="item-summary">${escapeHtml(item.summary || "")}</div>
          <div class="item-source">來源：${escapeHtml(item.source_name || "")}</div>
        </div>
      </a>
    `
      )
      .join("");
  };

  const renderDeepCards = (items, fallback) => {
    if (!items || items.length === 0) {
      return `<div style="padding:28px;color:var(--muted);font-family:'Noto Serif TC',serif;">${escapeHtml(fallback)}</div>`;
    }

    return items
      .map(
        (item, index) => `
      <article class="deep-card">
        <div class="deep-number">${String(index + 1).padStart(2, "0")}</div>
        <div class="deep-label">${escapeHtml(item.category || "ANALYSIS")}</div>
        <div class="deep-title">${escapeHtml(item.title || "")}</div>
        <div class="deep-body">${escapeHtml(item.analysis || "")}</div>
        <div class="deep-source">來源：<a href="${escapeHtml(item.source_url || "#")}" target="_blank" rel="noopener" style="color:inherit">${escapeHtml(item.source_name || "")}</a></div>
      </article>
    `
      )
      .join("");
  };

  const renderArchiveCards = (items) => {
    if (!items || items.length === 0) {
      return '<div style="color:var(--muted);font-family:\'Noto Serif TC\',serif;padding:20px 0;">尚無封存資料，首次執行流程後會自動建立。</div>';
    }

    return items
      .slice(0, 90)
      .map((item) => {
        const fileName = String(item.file || "").replace(/^archive\//, "");
        return `
        <a class="archive-card" href="${fileName ? `./${escapeHtml(fileName)}` : "#"}">
          <div class="arc-date">${escapeHtml(item.date || "")} ${escapeHtml(item.editionTime || "")}</div>
          <div class="arc-edition">${escapeHtml((item.dateLabel || item.date || "").slice(0, 10))} ${escapeHtml(item.editionLabel || "")}</div>
          <div class="arc-count">點擊查看當期封存頁</div>
        </a>
      `;
      })
      .join("");
  };

  const renderArchiveList = (items) => {
    if (!items || items.length === 0) {
      return '<a class="archive-item" href="#"><div class="archive-date">尚無資料</div><div class="archive-edition">等待首次更新</div></a>';
    }

    return items
      .slice(0, 30)
      .map((item) => {
        const fileName = String(item.file || "").replace(/^archive\//, "");
        return `
        <a class="archive-item" href="${fileName ? `archive/${escapeHtml(fileName)}` : "#"}">
          <div class="archive-date">${escapeHtml(item.date || "")} ${escapeHtml(item.editionTime || "")}</div>
          <div class="archive-edition">${escapeHtml((item.dateLabel || item.date || "").slice(0, 10))} ${escapeHtml(item.editionLabel || "")}</div>
        </a>
      `;
      })
      .join("");
  };

  const loadData = async (path) => {
    try {
      return await fetchJson(path);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const rootMorningGrid = document.getElementById("morning-news-grid");
  const rootMorningDeep = document.getElementById("morning-deep-grid");
  const rootArchiveList = document.getElementById("archive-list");
  const currentEdition = document.getElementById("current-edition");
  const todayDate = document.getElementById("today-date");
  const yearNode = document.getElementById("year");

  if (rootMorningGrid || rootMorningDeep || rootArchiveList) {
    const data = await loadData("news-data.json");
    if (data) {
      if (currentEdition && data.editionLabel && data.editionTime) {
        currentEdition.textContent = `${data.editionLabel} ${data.editionTime}`;
      }
      if (todayDate && data.dateLabel) {
        todayDate.textContent = data.dateLabel;
      }
      if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
      }
      if (rootMorningGrid) {
        rootMorningGrid.innerHTML = renderNewsCards(
          (data.newsData && data.newsData.headlines) || [],
          "目前尚未載入最新新聞，請先執行 n8n 流程。"
        );
      }
      if (rootMorningDeep) {
        rootMorningDeep.innerHTML = renderDeepCards(
          (data.newsData && data.newsData.deep_dive) || [],
          "目前尚未產生深度觀察內容。"
        );
      }
      if (rootArchiveList) {
        rootArchiveList.innerHTML = renderArchiveList(data.archiveList || []);
      }
    }
  }

  const categoryTargets = [
    { id: "tech-news-list", key: "techNews", label: "科技" },
    { id: "finance-news-list", key: "financeNews", label: "財經" },
    { id: "stock-news-list", key: "stockNews", label: "台股" }
  ];

  if (categoryTargets.some((target) => document.getElementById(target.id))) {
    const data = await loadData("../news-data.json");
    if (data) {
      categoryTargets.forEach((target) => {
        const node = document.getElementById(target.id);
        if (node) {
          const items = data[target.key] || [];
          node.innerHTML = renderCategoryItems(items, `目前尚未載入 ${target.label} 新聞。`);
        }
      });

      ["tech", "finance", "stock"].forEach((prefix) => {
        const metaNode = document.getElementById(`${prefix}-meta`);
        if (metaNode) {
          metaNode.textContent = `${data.dateLabel || ""} · ${data.editionLabel || ""} ${data.editionTime || ""}`;
        }
      });
    }
  }

  const archiveGrid = document.getElementById("archive-grid");
  if (archiveGrid) {
    const data = await loadData("../news-data.json");
    if (data) {
      archiveGrid.innerHTML = renderArchiveCards(data.archiveList || []);
    }
  }
})();
