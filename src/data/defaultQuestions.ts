import { Question } from '../types/game';

export const INITIAL_QUESTIONS: Question[] = [
  // ==================== PHẦN 1: TRANG WEB VÀ HTML ====================
  {
    id: 'p1_q1',
    section: 'section1',
    title: 'Khái niệm ngôn ngữ HTML',
    question: 'HTML là viết tắt của cụm từ tiếng Anh nào sau đây?',
    options: [
      'Hypertext Markup Language (Ngôn ngữ đánh dấu siêu văn bản)',
      'Hyperlink Text Management Language',
      'High Technology Modern Language',
      'Home Tool Markup Language'
    ],
    correctAnswerIndex: 0,
    explanation: 'Theo SGK Tin học 12 KNTT (trang 39): HTML là viết tắt của Hypertext Markup Language (ngôn ngữ đánh dấu siêu văn bản), là một bộ quy tắc dùng để thiết lập cấu trúc và hiển thị nội dung trang web.',
    points: 10,
    badge: 'Khái niệm cốt lõi'
  },
  {
    id: 'p1_q2',
    section: 'section1',
    title: 'Phần mở rộng của tệp trang web',
    question: 'Trang web được thiết lập từ các tệp văn bản thường có phần mở rộng là gì?',
    options: [
      '.docx hoặc .pdf',
      '.html hoặc .htm',
      '.txt hoặc .rtf',
      '.web hoặc .site'
    ],
    correctAnswerIndex: 1,
    explanation: 'Theo SGK Tin 12 (trang 40): Trang web được thiết lập từ các tệp văn bản thường có phần mở rộng là .html hoặc .htm được gọi là trang html.',
    points: 10,
    badge: 'Tệp trang web'
  },
  {
    id: 'p1_q3',
    section: 'section1',
    title: 'Cú pháp thẻ đánh dấu HTML',
    question: 'Các kí tự đánh dấu đặc biệt của thẻ HTML (HTML tag) được đặt trong cặp dấu nào?',
    options: [
      'Ngoặc vuông [ ]',
      'Ngoặc nhọn { }',
      'Cặp dấu < và >',
      'Ngoặc đơn ( )'
    ],
    correctAnswerIndex: 2,
    explanation: 'SGK trang 40: Các kí tự đánh dấu đặc biệt nằm trong hai dấu "<", ">" được gọi là thẻ đánh dấu HTML (còn gọi là thẻ HTML hay tag).',
    points: 10,
    badge: 'Cú pháp thẻ'
  },
  {
    id: 'p1_q4',
    section: 'section1',
    title: 'Quy tắc phân biệt chữ hoa, chữ thường',
    question: 'Tên thẻ HTML có phân biệt chữ hoa và chữ thường không?',
    options: [
      'Có phân biệt, bắt buộc viết HOA toàn bộ',
      'Không phân biệt chữ hoa, chữ thường nhưng mặc định nên viết chữ thường',
      'Bắt buộc chữ đầu viết hoa, chữ sau viết thường',
      'Chỉ có các thẻ đơn mới phân biệt chữ hoa, chữ thường'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 40: "Tên thẻ HTML không phân biệt chữ hoa, chữ thường nhưng mặc định tên thẻ được viết chữ thường."',
    points: 10,
    badge: 'Quy tắc chuẩn'
  },
  {
    id: 'p1_q5',
    section: 'section1',
    title: 'Thẻ đơn trong HTML',
    question: 'Thẻ nào sau đây là ví dụ về thẻ đơn (chỉ có thẻ bắt đầu, không có thẻ kết thúc riêng biệt)?',
    options: [
      '<p> và </p>',
      '<h1> và </h1>',
      '<hr/> (dòng kẻ ngang) và <br/> (ngắt xuống dòng)',
      '<div> và </div>'
    ],
    correctAnswerIndex: 2,
    explanation: 'SGK trang 40: Các thẻ đơn chỉ có thẻ bắt đầu, có dạng <tên thẻ> hoặc <tên thẻ/>, ví dụ <hr/> (dòng kẻ ngang), <br/> (ngắt xuống dòng).',
    points: 10,
    badge: 'Thẻ đơn'
  },
  {
    id: 'p1_q6',
    section: 'section1',
    title: 'Xử lý khoảng trắng và phím Enter trong HTML',
    question: 'Khi người soạn thảo gõ nhiều dấu cách liên tiếp hoặc nhấn phím Enter xuống dòng trong mã nguồn HTML, trình duyệt web sẽ xử lý như thế nào?',
    options: [
      'Trình duyệt hiển thị đúng chính xác số khoảng trắng và dòng Enter đã gõ',
      'Trình duyệt báo lỗi cú pháp mã nguồn',
      'Trình duyệt hiểu nhiều dấu cách là 1 dấu cách và KHÔNG nhận biết phím Enter xuống dòng',
      'Trình duyệt tự động chèn thêm thẻ <br> tại mọi chỗ nhấn Enter'
    ],
    correctAnswerIndex: 2,
    explanation: 'SGK trang 40: HTML và trình duyệt không nhận biết được nhiều dấu cách (hiểu là 1 dấu cách). Trình duyệt cũng không nhận biết dấu xuống dòng khi người dùng nhấn Enter trong quá trình soạn thảo. Cần dùng <br/> hoặc chia đoạn <p>.',
    points: 15,
    badge: 'Nguyên lý hiển thị'
  },
  {
    id: 'p1_q7',
    section: 'section1',
    title: 'Khái niệm Phần tử HTML (element)',
    question: 'Phần tử HTML (HTML element) được định nghĩa bao gồm những thành phần nào?',
    options: [
      'Chỉ gồm thẻ bắt đầu và tên thuộc tính',
      'Chỉ là phần nội dung văn bản thuần túy',
      'Thẻ bắt đầu, thẻ kết thúc và phần nội dung nằm giữa cặp thẻ đó (hoặc thẻ đơn cùng nội dung)',
      'Chỉ là dòng thông báo <!DOCTYPE html>'
    ],
    correctAnswerIndex: 2,
    explanation: 'SGK trang 40: Phần tử HTML thông thường được định nghĩa bởi thẻ bắt đầu, thẻ kết thúc và phần nội dung nằm giữa cặp thẻ này: <tên thẻ> nội dung </tên thẻ>. Các thẻ đơn cùng nội dung của nó cũng được gọi là phần tử HTML.',
    points: 15,
    badge: 'Phần tử HTML'
  },
  {
    id: 'p1_q8',
    section: 'section1',
    title: 'Bản chất của dòng <!DOCTYPE html>',
    question: 'Dòng đầu tiên trong tệp HTML: <!DOCTYPE html> có vai trò gì và có được xem là phần tử HTML không?',
    options: [
      'Là phần tử gốc của trang web, chứa toàn bộ trang',
      'Thông báo kiểu của tệp là html cho trình duyệt và KHÔNG được xem là phần tử HTML',
      'Là một thẻ đơn định dạng dòng văn bản đầu tiên',
      'Là phần tử bắt buộc nằm bên trong thẻ <head>'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 41 & 42: "Dòng đầu tiên của mỗi tệp HTML có dạng <!DOCTYPE html> có vai trò thông báo kiểu của tệp là html và KHÔNG được xem là phần tử HTML."',
    points: 15,
    badge: 'Lưu ý cốt lõi'
  },
  {
    id: 'p1_q9',
    section: 'section1',
    title: 'Cú pháp dòng chú thích trong HTML',
    question: 'Đoạn mã nào sau đây là cú pháp chú thích (comment) hợp lệ trong tệp HTML?',
    options: [
      '// Đây là dòng chú thích',
      '/* Đây là dòng chú thích */',
      '<!-- Đây là dòng chú thích -->',
      '# Đây là dòng chú thích'
    ],
    correctAnswerIndex: 2,
    explanation: 'SGK trang 41: Phần tử HTML đặc biệt có ý nghĩa chú thích trong tệp HTML có dạng: <!-- đây là dòng chú thích -->.',
    points: 10,
    badge: 'Cú pháp chú thích'
  },

  // ==================== PHẦN 2: CẤU TRÚC CƠ BẢN CỦA MỘT TỆP HTML ====================
  {
    id: 'p2_q1',
    section: 'section2',
    title: 'Phần tử gốc của tệp HTML',
    question: 'Trong sơ đồ cấu trúc của một tệp HTML, phần tử nào là phần tử gốc (root element) và có bao nhiêu phần tử gốc?',
    options: [
      '<!DOCTYPE html> là phần tử gốc, có 1 phần tử gốc',
      'Phần tử <html> là phần tử gốc và duy nhất có 1 phần tử gốc',
      '<head> và <body> là 2 phần tử gốc cùng cấp',
      '<title> là phần tử gốc'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 42 & 43: Phần tử <html> là bắt buộc, là phần tử gốc và chứa tất cả các phần tử HTML còn lại của trang web. Cây HTML chỉ có DUY NHẤT một phần tử gốc chính là phần tử <html>.',
    points: 10,
    badge: 'Phần tử gốc'
  },
  {
    id: 'p2_q2',
    section: 'section2',
    title: 'Hai phần tử con trực tiếp của <html>',
    question: 'Phần tử gốc <html> thông thường chứa đúng hai phần tử con trực tiếp nào?',
    options: [
      '<title> và <meta>',
      '<h1> và <p>',
      '<head> và <body>',
      '<header> và <footer>'
    ],
    correctAnswerIndex: 2,
    explanation: 'SGK trang 42: "Phần tử <html> thường chứa hai phần tử con <head> và <body>."',
    points: 10,
    badge: 'Cấu trúc 2 nhánh'
  },
  {
    id: 'p2_q3',
    section: 'section2',
    title: 'Nhiệm vụ của phần tử <head>',
    question: 'Phần tử <head> trong tệp HTML có chức năng gì?',
    options: [
      'Chứa tất cả nội dung văn bản và hình ảnh hiển thị trên trang web',
      'Chứa các phần tử có liên quan chung đến toàn bộ trang web (tiêu đề tab, mã hóa ký tự, liên kết mã...)',
      'Tạo thanh cuộn cho trình duyệt web',
      'Tạo dòng tiêu đề lớn nhất trong trang'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 42: "Phần tử <head> chứa các phần tử có liên quan chung đến toàn bộ trang web. Trong <head> thường có phần tử <title>, <meta>, <style>, <script>."',
    points: 10,
    badge: 'Khối thông tin chung'
  },
  {
    id: 'p2_q4',
    section: 'section2',
    title: 'Đặc điểm của phần tử <title>',
    question: 'Khẳng định nào sau đây là ĐÚNG về phần tử <title>?',
    options: [
      '<title> nằm trong <body> và hiển thị dòng chữ to nhất ở giữa trang',
      '<title> nằm trong <head>, hiển thị trên thanh tiêu đề/tab của trình duyệt và chỉ là văn bản thường, KHÔNG chứa phần tử con',
      '<title> có thể chứa các phần tử con như <h1>, <p>, <b>',
      '<title> là phần tử tùy chọn, không xuất hiện trên kết quả tìm kiếm'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 42: "Phần tử <title> nằm trong <head>. Thẻ <title> mô tả tên của trang web hiện thời, xuất hiện trong danh sách kết quả tìm kiếm. Phần tử <title> phải là văn bản thường và KHÔNG được phép chứa các phần tử con."',
    points: 15,
    badge: 'Thẻ tiêu đề trang'
  },
  {
    id: 'p2_q5',
    section: 'section2',
    title: 'Ý nghĩa của thẻ <meta charset="utf-8">',
    question: 'Thẻ <meta charset="utf-8"> nằm trong <head> dùng để làm gì?',
    options: [
      'Để định dạng phông chữ to và in đậm toàn trang',
      'Để mô tả cách mã hóa văn bản trên trang web theo chuẩn Unicode UTF-8 (hỗ trợ tiếng Việt không lỗi font)',
      'Để tải hình ảnh về trang web',
      'Để tạo liên kết sang trang web khác'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 42: "Phần tử <meta charset="utf-8"> mô tả cách mã hoá văn bản trên trang web theo mã UTF-8 (Unicode)."',
    points: 10,
    badge: 'Mã hóa ký tự'
  },
  {
    id: 'p2_q6',
    section: 'section2',
    title: 'Nhiệm vụ của phần tử <body>',
    question: 'Phần tử <body> có vai trò gì trong cấu trúc tệp HTML?',
    options: [
      'Chứa các thông tin cấu hình ẩn của trang web',
      'Chứa tất cả các phần tử thông tin của trang web hiển thị cho người xem (văn bản, ảnh, bảng...)',
      'Chỉ chứa duy nhất thẻ <title>',
      'Chỉ có tác dụng khai báo ngôn ngữ'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 42: "Phần tử <body> chứa tất cả các phần tử còn lại là thông tin của trang web."',
    points: 10,
    badge: 'Thân trang web'
  },
  {
    id: 'p2_q7',
    section: 'section2',
    title: 'Thứ tự các thẻ tiêu đề văn bản',
    question: 'Nhóm thẻ định dạng tiêu đề nào sau đây được sắp xếp theo thứ tự GIẢM DẦN về kích thước/cấp độ?',
    options: [
      '<h6>, <h5>, <h4>, <h3>, <h2>, <h1>',
      '<h1>, <h2>, <h3>, <h4>, <h5>, <h6>',
      '<head1>, <head2>, <head3>, <head4>',
      '<title1>, <title2>, <title3>'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 42: "Nhóm các thẻ định dạng văn bản thường dùng là các thẻ tiêu đề theo thứ tự giảm cấp dần là <h1>, <h2>, <h3>, <h4>, <h5>, <h6>. Thẻ <p> mô tả một đoạn văn bản hoàn chỉnh."',
    points: 10,
    badge: 'Tiêu đề cấp độ'
  },
  {
    id: 'p2_q8',
    section: 'section2',
    title: 'Mối quan hệ trong cây thông tin HTML',
    question: 'Trong cây thông tin (Hình 7.4 SGK trang 42), mối quan hệ giữa <html> với <head> và <body> là mối quan hệ gì?',
    options: [
      'Quan hệ anh em cùng cấp',
      'Quan hệ Cha - Con (<html> là nút cha, <head> và <body> là hai nút con)',
      'Quan hệ độc lập không lồng nhau',
      'Quan hệ kế thừa ngược (con chứa cha)'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 42 & 43: "Cấu trúc chung của một trang web có thể hình dung như một cây thông tin các phần tử HTML có quan hệ cha con (lồng nhau), nút gốc (root) là phần tử <html>."',
    points: 15,
    badge: 'Cây thông tin DOM'
  },

  // ==================== PHẦN 3: PHẦN MỀM SOẠN THẢO HTML ====================
  {
    id: 'p3_q1',
    section: 'section3',
    title: 'Phần mềm soạn thảo văn bản đơn giản',
    question: 'Phần mềm soạn thảo văn bản đơn giản, không định dạng có sẵn trên hệ điều hành Windows là gì?',
    options: [
      'Microsoft Word',
      'Notepad (trên macOS tương tự là TextEdit)',
      'Sublime Text',
      'Adobe Photoshop'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 43: "Notepad là phần mềm soạn thảo văn bản đơn giản không định dạng, cung cấp một số chức năng chỉnh sửa cơ bản, có sẵn trên Windows. Trên macOS có phần mềm tương tự là TextEdit."',
    points: 10,
    badge: 'Soạn thảo đơn giản'
  },
  {
    id: 'p3_q2',
    section: 'section3',
    title: 'Chọn ngôn ngữ HTML trong Notepad++',
    question: 'Trong phần mềm Notepad++, để hiển thị và hỗ trợ soạn thảo đúng ngôn ngữ HTML, ta thực hiện lệnh nào?',
    options: [
      'File -> New -> Web',
      'Language -> H -> HTML',
      'View -> HTML Mode',
      'Settings -> Preferences -> Format'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 43 (Lưu ý): "Để phần mềm hiển thị và hỗ trợ soạn thảo đúng HTML cần thực hiện lệnh Language -> H -> HTML để chọn ngôn ngữ HTML."',
    points: 15,
    badge: 'Thao tác Notepad++'
  },
  {
    id: 'p3_q3',
    section: 'section3',
    title: 'Chọn ngôn ngữ HTML trong Sublime Text',
    question: 'Trong phần mềm Sublime Text, để hiển thị và hỗ trợ soạn thảo đúng theo ngôn ngữ HTML, ta thực hiện lệnh nào?',
    options: [
      'View -> Syntax -> HTML',
      'File -> Encoding -> UTF-8',
      'Language -> Select -> HTML',
      'Tools -> Build -> Web'
    ],
    correctAnswerIndex: 0,
    explanation: 'SGK trang 43 (Lưu ý): "Để phần mềm hiển thị và hỗ trợ soạn thảo đúng theo ngôn ngữ HTML cần thực hiện lệnh View -> Syntax -> HTML để chọn ngôn ngữ HTML."',
    points: 15,
    badge: 'Thao tác Sublime Text'
  },
  {
    id: 'p3_q4',
    section: 'section3',
    title: 'Trang web hỗ trợ soạn thảo HTML trực tuyến',
    question: 'Đặc điểm nào sau đây mô tả đúng về các trang web hỗ trợ soạn thảo HTML trực tuyến (ví dụ: w3schools.com, tutorialspoint.com)?',
    options: [
      'Không cần máy tính, chỉ cần sổ ghi chép',
      'Cần kết nối Internet, giao diện 2 khung: khung trái soạn mã, nháy nút Run để quan sát ngay kết quả hiển thị ở khung phải',
      'Bắt buộc phải trả phí bản quyền hàng tháng',
      'Chỉ chạy được trên hệ điều hành Linux'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 44: "Ví dụ Hình 7.6 là giao diện soạn thảo HTML trực tuyến. Việc soạn thảo HTML được thực hiện tại khung bên trái, nháy nút Run để kiểm tra kết quả tại khung bên phải. Một số trang phổ biến: w3schools.com, tutorialspoint.com..."',
    points: 15,
    badge: 'Soạn thảo online'
  },
  {
    id: 'p3_q5',
    section: 'section3',
    title: 'Phân loại phần mềm soạn thảo và trình duyệt',
    question: 'Trong các phần mềm sau: a) Notepad, b) Opera, c) Sublime Text, d) Chrome, e) Cốc Cốc, f) Notepad++, g) FireFox, h) Microsoft Edge. Đâu là nhóm CÁC TRÌNH DUYỆT WEB?',
    options: [
      'Notepad, Sublime Text, Notepad++',
      'Opera, Chrome, Cốc Cốc, FireFox, Microsoft Edge',
      'Notepad, Chrome, Opera, Sublime Text',
      'TextEdit, Notepad++, Opera, Chrome'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 44 (Câu hỏi 1): Nhóm trình duyệt web gồm: Opera, Chrome, Cốc Cốc, FireFox, Microsoft Edge. Nhóm phần mềm soạn thảo gồm: Notepad, Sublime Text, Notepad++.',
    points: 15,
    badge: 'Phân loại phần mềm'
  },
  {
    id: 'p3_q6',
    section: 'section3',
    title: 'Lịch sử phát triển HTML',
    question: 'Ai là người đưa ra các chuẩn HTML đầu tiên vào những năm 1990 tại CERN và phiên bản HTML5 ra đời vào năm nào?',
    options: [
      'Bill Gates - năm 2000',
      'Tim Berners-Lee - năm 2014',
      'Steve Jobs - năm 2010',
      'Mark Zuckerberg - năm 2018'
    ],
    correctAnswerIndex: 1,
    explanation: 'SGK trang 45: "Các chuẩn HTML của trang web hiện nay được nhà vật lí Tim Berners-Lee đưa ra lần đầu tiên vào những năm 1990... Phiên bản hiện tại là HTML5 ra đời năm 2014."',
    points: 15,
    badge: 'Lịch sử công nghệ'
  }
];

export const INITIAL_STUDENTS = [
  { id: 'hs01', name: 'Nguyễn Văn An', group: 'Nhóm 1 (Tổ 1)', score: 0 },
  { id: 'hs02', name: 'Trần Thị Bình', group: 'Nhóm 1 (Tổ 1)', score: 0 },
  { id: 'hs03', name: 'Lê Hoàng Cường', group: 'Nhóm 1 (Tổ 1)', score: 0 },
  { id: 'hs04', name: 'Phạm Minh Đức', group: 'Nhóm 2 (Tổ 2)', score: 0 },
  { id: 'hs05', name: 'Hoàng Thu Giang', group: 'Nhóm 2 (Tổ 2)', score: 0 },
  { id: 'hs06', name: 'Đỗ Hải Hà', group: 'Nhóm 2 (Tổ 2)', score: 0 },
  { id: 'hs07', name: 'Vũ Quốc Hưng', group: 'Nhóm 3 (Tổ 3)', score: 0 },
  { id: 'hs08', name: 'Đặng Mai Lan', group: 'Nhóm 3 (Tổ 3)', score: 0 },
  { id: 'hs09', name: 'Bùi Tuấn Nam', group: 'Nhóm 3 (Tổ 3)', score: 0 },
  { id: 'hs10', name: 'Ngô Phương Oanh', group: 'Nhóm 4 (Tổ 4)', score: 0 },
  { id: 'hs11', name: 'Lý Trọng Quân', group: 'Nhóm 4 (Tổ 4)', score: 0 },
  { id: 'hs12', name: 'Trịnh Thanh Thảo', group: 'Nhóm 4 (Tổ 4)', score: 0 },
];
