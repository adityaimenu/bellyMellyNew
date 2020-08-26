<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SendMail.aspx.cs" Inherits="SendMail" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
     <script type="text/javascript" src="assets/js/jquery.min.js"></script>

    <script type="text/javascript">

       /* parent.ShowThankYouMsg = function () {
         alert('thank you for contacting');
        }*/
        function successEmail() {
            alert('hello');


            parent.document.getElementById("btnReset").click();

            parent.ShowThankYouMsg();

        }
        
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div style="display:none;">

        
    </div>
    </form>
</body>
</html>
