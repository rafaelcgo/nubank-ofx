  const startOfx = () => {
    return `
OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<BANKMSGSRSV1>
<STMTTRNRS>
<STMTRS>
<BANKTRANLIST>`;
  }

  const endOfx = () =>
    `
</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;

  const bankStatement = (date, amount, description) =>
    `
<STMTTRN>
<TRNTYPE>OTHER</TRNTYPE>
<DTPOSTED>${date}</DTPOSTED>
<TRNAMT>${-amount}</TRNAMT>
<MEMO>${description}</MEMO>
</STMTTRN>`;

  const normalizeAmount = (text) =>
    text.replace('.', '').replace(',','.');

  const normalizeDay = (date) =>
    date.split(' ')[0];

  const normalizeMonth = (date) => {
    const month = date.split(' ')[1]
    const months = {
      'Jan': '01',
      'Fev': '02',
      'Mar': '03',
      'Abr': '04',
      'Mai': '05',
      'Jun': '06',
      'Jul': '07',
      'Ago': '08',
      'Set': '09',
      'Out': '10',
      'Nov': '11',
      'Dez': '12'
    }

    return months[month];
  }

  const normalizeYear = (date) => {
    const dateArray = date.split(' ');
    if (dateArray.length > 2) {
      return '20'+dateArray[2];
    } else {
      return new Date().getFullYear();
    };
  }

  const normalizeDate = (date) =>
    normalizeYear(date)+normalizeMonth(date)+normalizeDay(date);

  const exportOfx = (ofx) => {
    const openMonth = " " + document.querySelector('md-tab.ng-scope.active .period').textContent.trim();
    const period = normalizeYear(openMonth) + "-" + normalizeMonth(openMonth);
    link = document.createElement("a");
    link.setAttribute("href", 'data:application/x-ofx,'+encodeURIComponent(ofx));
    link.setAttribute("download", "nubank-" + period + ".ofx");
    link.click();
  }

  const generateOfx = () => {
    let ofx = startOfx();

    document.querySelectorAll('.charge:not([style=\'display:none\'])').forEach(function(charge){
      const date = normalizeDate(charge.querySelector('.time').textContent);
      const description = charge.querySelector('.description').textContent.trim();
      const amount = normalizeAmount(charge.querySelector('.amount').textContent);

      ofx += bankStatement(date, amount, description);
    });

    ofx += endOfx();
    exportOfx(ofx);
  }
  
generateOfx();
