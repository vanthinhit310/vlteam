var socket = io("/");

// var socket = io("https://chichchich.herokuapp.com/");


// socket.on("server-send-dki-thatbai", function () {
//     alert("Sai Username (co nguoi da dang ki roi!!!)");
// });
//
// socket.on("server-send-danhsach-Users", function (data) {
//     $("#boxContent").html("");
//     var current = $("#currentUser").html();
//     data.forEach(function (i) {
//         if (current === i) {
//             $("#boxContent").append("<div style='color: red' class='user'>" + i + "</div>");
//         } else {
//             $("#boxContent").append("<div class='user'>" + i + "</div>");
//         }
//     });
// });
//
// socket.on("server-send-dki-thanhcong", function (data) {
//     $("#currentUser").html(data);
// });
//
// socket.on("server-send-mesage", function (data) {
//     if (!document.hasFocus()) {
//         $('#audio').get(0).play();
//         var noiDung;
//         if (data.nd.indexOf('<a href=') !== -1) {
//             noiDung = "Đường dẫn đến file"
//         } else {
//             noiDung = data.nd;
//         }
//
//         var notify = new Notification(
//             data.un, // Tiêu đề thông báo
//             {
//                 body: noiDung// Nội dung thông báo
//             }
//         );
//     }
//     var currentUser = $('#currentUser').html();
//     if (currentUser === data.un) {
//         $("#listMessages").prepend("<div class='ms' style='text-align: right;color: red'>"+data.nd + ":" + data.un + "</div>");
//     } else {
//         $("#listMessages").prepend("<div class='ms' style='text-align: left;color: blue'>" + data.un + ":" + data.nd + "</div>");
//     }
//
// });
//
// socket.on("ai-do-dang-go-chu", function (data) {
//     $("#thongbao").html("<span class='glyphicon glyphicon-pencil'></span>" + data);
// });
//
// socket.on("ai-do-STOP-go-chu", function () {
//     $("#thongbao").html("");
// });
//
//
// $(document).ready(function () {
//
//     Notification.requestPermission(function (p) {});
//     $('#photos-input').on('change', function () {
//         var size = this.files[0].size;
//         if (size > 500000000) {
//             alert('Không ổn rồi. Đã bảo là không được hơn 500MB');
//             $('#photos-input').val('');
//         }
//     });
//     $("#txtMessage").focusin(function () {
//         socket.emit("toi-dang-go-chu");
//     });
//
//     $("#txtMessage").focusout(function () {
//         socket.emit("toi-stop-go-chu");
//     });
//
//     // $("#btnRegister").click(function () {
//
//         socket.emit("client-send-Username", '');
//     // });
//
//     $("#btnLogout").click(function () {
//         socket.emit("logout");
//         $("#chatForm").hide(2000);
//         $("#loginForm").show(1000);
//     });
//
//     $("#btnSendMessage").click(function () {
//         var ms = $("#txtMessage");
//         if (ms.val().length === 0) {
//             $("#thongbao").html('Chưa nhập nội dung kìa óc chó !')
//         } else {
//             socket.emit("user-send-message", ms.val());
//             ms.val('');
//         }
//
//     });
//
//     $("#txtMessage").keyup(function (e) {
//         if (e.keyCode === 13) {
//             $("#btnSendMessage").click();
//         }
//     });
// });
