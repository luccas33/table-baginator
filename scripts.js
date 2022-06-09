
let pager = newPaginator();

function main() {
    let data = [];
    for (let i = 1; i <= 95; i++) {
        data.push({name: 'Name ' + i, value: i});
    }
    pager.setData(data);
    pager.addOnPageChange(() => document.getElementById('table-body').innerHTML = generateTableBody(pager.pageData));
    pager.firstPage();
}

function generateTableBody(data) {
    let html = '';
    data.forEach(d => {
        html += `
            <tr>
                <td>${d.name}</td>
                <td class="txt-right">${d.value}</td>
            </tr>
        `;
    });
    html += `
        <tr>
            <th colspan="2" class="table-nav">
                <button onclick="pager.firstPage()">First</button>
                <button onclick="pager.previousPage()">Previous</button>
                <label id="page-number">Page ${pager.page} / ${pager.pagesQtt}</label>
                <button onclick="pager.nextPage()">Next</button>
                <button onclick="pager.lastPage()">Last</button>
            </th>
        </tr>
    `;
    return html;
}

function onPageChange() {
    document.getElementById('table-body').innerHTML = generateTable(pager.pageData);
}

function newPaginator() {
    let paginator = {
        rowsQtt: 10,
        data: [],
        pagesQtt: 1,
        page: 1,
        pageData: [],
        onPageChange: []
    };

    paginator.setData = (list) => {
        if (!list) {
            return;
        }
        paginator.data = list;
        paginator.calcPages();
    }

    paginator.setRowsQuantity = (qtt) => {
        paginator.rowsQtt = qtt;
        paginator.calcPages();
    }

    paginator.addOnPageChange = (runner) => {
        paginator.onPageChange.push(runner);
    }

    paginator.firstPage = () => {
        paginator.navToPage(1);
    }

    paginator.nextPage = () => {
        paginator.navToPage(paginator.page + 1);
    }

    paginator.previousPage = () => {
        paginator.navToPage(paginator.page - 1);
    }

    paginator.lastPage = () => {
        paginator.navToPage(paginator.pagesQtt);
    }

    paginator.navToPage = (pg) => {
        if (paginator.data.length === 0) {
            return;
        }
        pg = pg < 1 ? 1 : pg;
        pg = pg > paginator.pagesQtt ? paginator.pagesQtt : pg;
        paginator.page = pg;
        let startIndex = (pg - 1) * paginator.rowsQtt;
        let endIndex = startIndex + paginator.rowsQtt - 1;
        endIndex = endIndex >= paginator.data.length ? paginator.data.length - 1 : endIndex;
        endIndex = endIndex < 0 ? 0 : endIndex;
        paginator.pageData = paginator.data.slice(startIndex, endIndex + 1);
        paginator.onPageChange.forEach(runner => runner());
    }

    paginator.calcPages = () => {
        paginator.rowsQtt = paginator.rowsQtt < 1 ? 10 : paginator.rowsQtt;
        paginator.pagesQtt = Math.trunc(paginator.data.length / paginator.rowsQtt);
        if (paginator.data.length % paginator.pagesQtt !== 0) {
            paginator.pagesQtt++;
        }
        paginator.firstPage();
    }

    return paginator;
}
