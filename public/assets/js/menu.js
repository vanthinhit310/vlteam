/**
 * Created by JINX_NHI on 4/11/2018.
 */
$(document).ready(function () {
    $('#btnDangXuat').on('click',function () {
       $.ajax({
           url:'/account/logout',
           type:'get',
           success:function (data) {
               if(data.data === 'ok'){
                   window.location.href = "/";
               }
           },
           error:function (err) {

           }
       }) ;
    });


});