function getMoreHtml (data) {
  let html = ''
  for (let item of data) {
    html += `<dl class="clearfix">
                <a href="${item.compound_url}">
                  <dt><img src="${item.structImage}" alt="" /></dt>
                  <dd class="font12">
                    <h5 class="mb-title-theme">${item.enName}</h5>
                    <p class="mb-blue">
                      CAS No. ${item.cas}
                    </p>
                    <span>Formula: ${item.molStruc.formula}</span>
                  </dd>
                </a>
              </dl>`
  }
  return html
}

function getLiHtml (data) {
  let html = ''
  for (let item of data) {
    html += `<li><a href="${item.compound_url}">${item.enName}</a></li>`
  }
  return html
}
export { getMoreHtml, getLiHtml }
