using System;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.IO;
using System.Data;
using System.Linq;

public partial class SendMail : System.Web.UI.Page
{
    private static string Mailusername = "customerservice@bellymelly.com";
    private static string FromUserName = "customerservice@bellymelly.com";
    private static string Mailpassword = "BellyMelly2018!@";
    private static string smptserver = "smtp.gmail.com";


    private string EmailTo = "kp@yopmail.com";

    //private static string EmailTo = "shital.malve@pointmatrix.com"; 

    private string strSubject = "Contact Us from BellyMelly.com";
    

    public delegate void CallSendMail(string EmailList, string strEmailBody, string strSubject, string strFrom);

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request["formtype"] == "contactus")
        {
            SendMailContactUs(Request["ContactName"], Request["ContactPhone"], Request["ContactEmail"], Request["Query"]);
        }
        else if (Request["formtype"] == "divein")
        {
            SendMailDiveIn(Request["Name"], Request["RestName"], Request["Phone"], Request["Email"]);
        }
        else if (Request["formtype"] == "dive-in")
        {
            SendMailDive_In(Request["Name"], Request["RestName"], Request["Phone"], Request["Email"]);
        }
        else if(Request["formtype"] == "signup")
        {
            SendSignUpMail(Request["Name"], Request["Address"], Request["Phone"], Request["RestaurantEmail"], Request["RestaurantName"], Request["Time"]);
        }
        else if(Request["formtype"] == "register-organization")
        {
            SendMailRegisterOrganization(Request["first_name"], Request["last_name"], Request["email_address"], Request["phone_number"], Request["address_line1"], Request["address_line2"], Request["city"], Request["state"], Request["zip"], Request["country"], Request["customCode"]);
        }
        else
        {
            HttpFileCollection uploadFiles = System.Web.HttpContext.Current.Request.Files;
            string strFilePath = UploadFile(uploadFiles);
            string[] values = strFilePath.Split('|');
            string MenuFile = values[0].Trim();
            string ChequeFile = values[1].Trim();
            if(MenuFile != "")
            {
                string[] val = MenuFile.Split(',');
                MenuFile = "";
                for (int i = 0; i < val.Length; i++)
               {
                MenuFile += "<br>" + val[i].Trim() + "</br>";
               }
            }
            if(ChequeFile != "")
            {
                string[] val2 = ChequeFile.Split(',');
                ChequeFile = "";
                for (int i = 0; i < val2.Length; i++)
                {
                    ChequeFile += "<br>" + val2[i].Trim() + "</br>";
                }
            }

            SendEMail(Request["ContactName"], Request["ContactPhone"], Request["ContactEmail"], Request["RestaurantName"]);
        }
    }
    
    private void SendSignUpMail(string Name,string Address, string Phone, string RestaurantEmail,string RestaurantName,string Time)
    {
        try
        {

            string strBody = "<b>Name: </b>" + Name +
                       "<br><br><b>Address: </b>" + Address +
                       "<br><br><b>Phone: </b>" + Phone +
                       "<br><br><b>Email: </b>" + RestaurantEmail +
                       "<br><br><b>Restaurant Name: </b>" + RestaurantName +
                       "<br><br><b>Preferred Time to Connect: </b>" + Time;

                string strSubject = "Sign Up from BellyMelly.com";

             CallSendMail objCallSendMail = new CallSendMail(sendmail);
            objCallSendMail.BeginInvoke(EmailTo, strBody, strSubject,"", null, null);

            this.Page.ClientScript.RegisterStartupScript(this.GetType(), "foo", "successEmail()", true);

        }
        catch(Exception ex)
        {
            Response.Write(ex.Message);
        }

    }

    

        private void SendMailDive_In(string Name, string RestaurantName, string Phone, string Email)
    {
        try
        {
            string strBody = "<b>Your Name: </b>" + Name +
                             "<br><br><b>Restaurant Name: </b>" + RestaurantName +
                             "<br><br><b>Phone Number: </b>" + Phone +
                             "<br><br><b>Email ID: </b>" + Email;

            strSubject = "Contact Us for Dine In from BellyMelly.com";

            string EmailsTo = EmailTo + ",aditya@bellymelly.com";

            CallSendMail objCallSendMail = new CallSendMail(sendmail);
            objCallSendMail.BeginInvoke(EmailsTo, strBody, strSubject,"", null, null);

            this.Page.ClientScript.RegisterStartupScript(this.GetType(), "foo", "successEmail()", true);
        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
        }
    }

    private void SendMailDiveIn(string Name, string RestaurantName, string Phone, string Email)
    {
        try
        {
            string strBody = "<b>Your Name: </b>" + Name +
                             "<br><br><b>Restaurant Name: </b>" + RestaurantName +
                             "<br><br><b>Phone Number: </b>" + Phone +
                             "<br><br><b>Email ID: </b>" + Email;

            //strSubject = "Contact Us for Dine In from BellyMelly.com";

            strSubject = "Contact Us for Dine In from 3rd Party";


            EmailTo = "aditya@bellymelly.com";


            CallSendMail objCallSendMail = new CallSendMail(sendmail);
            objCallSendMail.BeginInvoke(EmailTo, strBody, strSubject,"", null, null);

            this.Page.ClientScript.RegisterStartupScript(this.GetType(), "foo", "successEmail()", true);
        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
        }
    }



    private void SendMailContactUs(string Name, string ContactPhone, string ContactEmail, string Query)
    {
        try
        {
            string strBody = "<b>Contact Name: </b>" + Name +
                             "<br><br><b>Phone Number: </b>" + ContactPhone +
                             "<br><br><b>Email: </b>" + ContactEmail + 
                             "<br><br><b>Query: </b>" + Query;

            CallSendMail objCallSendMail = new CallSendMail(sendmail);
            objCallSendMail.BeginInvoke(EmailTo, strBody, strSubject,"", null, null);

            this.Page.ClientScript.RegisterStartupScript(this.GetType(), "foo", "successEmail()", true);
        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
        }
    }

    private void SendMailRegisterOrganization(string FName, string LName, string Email, string Phone, string add1, string add2, string city, string state, string zip, string country, string customCode)
    {
        try
        {
            string strBody = "<b>Contact Name: </b> " + FName + " <br><br><b> Organization's Name: </b> " + LName +
                             "<br><br><b>Email: </b>" + Email + "<br><br><b>Phone : </b>" + Phone +
                             "<br><br><b>Address Line1: </b>" + add1 + "<br><br><b>Address Line2: </b>" + add2 +
                             "<br><br><b>City: </b>" + city + "<br><br><b>State: </b>" + state +
                             "<br><br><b>Zip: </b>" + zip + "<br><br><b>Country: </b>" + country +
                             "<br><br><b>Custom Code: </b>" + customCode;

            CallSendMail objCallSendMail = new CallSendMail(sendmail);

            objCallSendMail.BeginInvoke(EmailTo, strBody, strSubject,"", null, null);

            string ContactEmail = Email, ContactName = FName;

            if (Email != "")
            {
                ThankYouMailOrganization(Email, FName, customCode);
            }

            this.Page.ClientScript.RegisterStartupScript(this.GetType(), "foo", "successEmail()", true);
        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
        }
    }

    public void ThankYouMailOrganization(string Email, string FName, string CustomCode)
    {
        try
        {
            string strSubject = "BellyMelly Organisation Onboarding Team";

            MailMessage myMail = new MailMessage();

            using (StreamReader reader = File.OpenText(System.IO.Path.Combine(Server.MapPath("~/templates/"), "BM_Organisation_Sign_Up.htm")))
            {
                myMail.Body = reader.ReadToEnd();
            }
            string strBody = myMail.Body;

            strBody = strBody.Replace("##ContactName##", FName);
            strBody = strBody.Replace("##CustomCode##", CustomCode);


            CallSendMail objCallSendMail = new CallSendMail(sendmail);
            objCallSendMail.BeginInvoke(Email, strBody, strSubject, "support@bellymelly.com", null, null);

            this.Page.ClientScript.RegisterStartupScript(this.GetType(), "foo", "successEmail()", true);

        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
        }
    }


    private void SendEMail(string ContactName, string ContactPhone, string ContactEmail, string RestaurantName, string RestaurantEmail, string RestaurantPhone, string restaurantaddress, string RestaurantHours, string taxRate, string ddlTimeZone, string PickUpPreparation, string TimePickupBegins, string DeliveryPreparation, string TimeDeliveryBegins, string DeliveryZone, string DeliveryMinimum, string DeliveryCharge, string MenuFile, string ChequeFile, string Organization, string plan)
    {
        try
        {
            string strAgent = Request.UserAgent;
            string BrowserName = Request.Browser.Browser.ToString();
            if (strAgent.ToLower().Contains("chrome"))
            {
                BrowserName = "Chrome";
            }
            else if (strAgent.ToLower().Contains("safari"))
            {
                BrowserName = "Safari";
            }

            BrowserName = "<b>Browser: </b>" + BrowserName + " " + Request.Browser.MajorVersion + " " + Request.Browser.MinorVersion + " " + Request.Browser.Platform + "<br>";


            string strBody = "<b>Contact Name: </b>" + ContactName + "<br><br><b>Contact Phone: </b>" + ContactPhone +
                             "<br><br><b>Contact Email: </b>" + ContactEmail + "<br><br><b>Restaurant DBA Name: </b>" + RestaurantName +
                             "<br><br><b>Restaurant Email: </b>" + RestaurantEmail + "<br><br><b>Restaurant Phone: </b>" + RestaurantPhone +
                             "<br><br><b>Restaurant Address: </b>" + restaurantaddress + "<br><br><b>Restaurant Hours: </b>" + RestaurantHours +
                             "<br><br><b>Tax Rate: </b>" + taxRate + "<br><br><b>Time Zone: </b>" + ddlTimeZone +
                             "<br><br><b>Time Required For Pick Ups: </b>" + PickUpPreparation + "<br><br><b>Restaurant Pick Up Hours: </b>" + TimePickupBegins +
                             "<br><br><b>Time Required for Delivery: </b>" + DeliveryPreparation + "<br><br><b>Restaurant Delivery Hours: </b>" + TimeDeliveryBegins +
                             "<br><br><b>Delivery Zone: </b>" + DeliveryZone + "<br><br><b>Delivery Minimum: </b>" + DeliveryMinimum +
                              "<br><br><b>Delivery Charge: </b>" + DeliveryCharge + "<br><br><b>Organization you would like to raise money for: </b>" + Organization +
                             "<br><br><b>Copy of Menu File: </b>" + MenuFile + "<br><br><b>Copy of Voided Cheque File: </b>" + ChequeFile +
                             "<br><br><b>Selected Plan: </b>" + plan + "<br>------------------------<br>" + BrowserName;

            /**/
            //CreateLead(first_name, last_name, email_address, phone_number, city, state, country, message);
            /**/


            CallSendMail objCallSendMail = new CallSendMail(sendmail);

            objCallSendMail.BeginInvoke(EmailTo, strBody, strSubject,"", null, null);

            if (ContactEmail != "")
            {
                ThankYouMail(ContactEmail, ContactName, RestaurantName);
                //ThankYouMailOrganization(ContactEmail, ContactName);
            }

            this.Page.ClientScript.RegisterStartupScript(this.GetType(), "foo", "successEmail()", true);
        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
        }
    }

    public void ThankYouMail(string ContactEmail, string ContactName, string RestaurantName)
    {
        string strSubject = "BellyMelly Onboarding Team";

        MailMessage myMail = new MailMessage();

            using (StreamReader reader = File.OpenText(System.IO.Path.Combine(Server.MapPath("~/templates/"), "BM_User_Sign_Up.htm"))) 
        {
            myMail.Body = reader.ReadToEnd();
        }
        string strBody = myMail.Body;

         strBody = strBody.Replace("##ContactName##", ContactName);

        strBody = strBody.Replace("##RestaurantName##", RestaurantName);


        CallSendMail objCallSendMail = new CallSendMail(sendmail);
        objCallSendMail.BeginInvoke(ContactEmail, strBody, strSubject, "support@bellymelly.com", null, null);

        this.Page.ClientScript.RegisterStartupScript(this.GetType(), "foo", "successEmail()", true);
    }

    private void CreateLead(string first_name, string last_name, string email_address, string phone_number, string city, string state, string country, string message)
    {
        var request = (HttpWebRequest)WebRequest.Create("https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8");

        var postData = "oid=00D100000003SNG";
        postData += "&retURL=https://bellymelly.com/index.html";
        postData += "&first_name=" + first_name;
        postData += "&last_name=" + last_name;
        postData += "&email=" + email_address;
        postData += "&phone=" + phone_number;
        postData += "&country=" + country;
        postData += "&state=" + state;
        postData += "&city=" + city;
        postData += "&street=";
        postData += "&description=" + message;

        var data = Encoding.ASCII.GetBytes(postData);

        ServicePointManager.SecurityProtocol = (SecurityProtocolType)48 | (SecurityProtocolType)192 | (SecurityProtocolType)768 | (SecurityProtocolType)3072;

        request.Method = "POST";
        request.ContentType = "application/x-www-form-urlencoded";
        request.ContentLength = data.Length;

        using (var stream = request.GetRequestStream())
        {
            stream.Write(data, 0, data.Length);
        }

        var response = (HttpWebResponse)request.GetResponse();

        var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
    }

    public string UploadFile(HttpFileCollection uploadFiles)
    {
        string strFilePath = "", menuFilePath = "", chequeFilePath = "";

        if (System.Web.HttpContext.Current.Request.Files.Count > 0)
        {
            int i;
            string sepMenu = "", sepCheque = "", menuFile = "", chequeFile = "";
            for (i = 0; i < uploadFiles.Count; i++)
            {
                if (uploadFiles.AllKeys[i].ToString() == "file_uplaod_menu")
                {
                    HttpPostedFile strFile = uploadFiles[i];
                    if (strFile.ContentLength > 0)
                    {
                        byte[] myFile = new byte[strFile.ContentLength];
                        strFile.InputStream.Read(myFile, 0, (int)strFile.ContentLength);
                        String strPath = System.Web.HttpContext.Current.Server.MapPath("UploadFile/");
                        DirectoryInfo d1 = new DirectoryInfo(strPath);
                        if (!d1.Exists)
                        {
                            d1.Create();
                        }
                        menuFile = System.IO.Path.Combine(strPath, strFile.FileName);
                        System.IO.File.WriteAllBytes(menuFile, myFile);
                        menuFilePath += sepMenu + menuFile;
                        sepMenu = ",";
                    }
                }
                else if (uploadFiles.AllKeys[i].ToString() == "file_uplaod_cheque")
                {
                    HttpPostedFile strFile = uploadFiles[i];
                    if (strFile.ContentLength > 0)
                    {
                        byte[] myFile = new byte[strFile.ContentLength];
                        strFile.InputStream.Read(myFile, 0, (int)strFile.ContentLength);
                        String strPath = System.Web.HttpContext.Current.Server.MapPath("UploadFile/");
                        DirectoryInfo d1 = new DirectoryInfo(strPath);
                        if (!d1.Exists)
                        {
                            d1.Create();
                        }
                        chequeFile = System.IO.Path.Combine(strPath, strFile.FileName);
                        System.IO.File.WriteAllBytes(chequeFile, myFile);
                        chequeFilePath += sepCheque + chequeFile;
                        sepCheque = ",";
                    }
                }
            }
        }
        strFilePath = menuFilePath + " | " + chequeFilePath;
        return strFilePath;
    }

    private void sendmail(string EmailList, string strEmailBody, string strSubject, string strFrom)
    {
        MailMessage message = new MailMessage();

        try
        {
            if (strFrom != "")
            {
                message.From = new MailAddress(strFrom, strFrom);
            }
            else
            {
                message.From = new MailAddress(Mailusername, FromUserName);
            }

            string[] strIds = EmailList.Split(',');
            foreach (string emailid in strIds)
            {
                if (emailid != "")
                    message.To.Add(new MailAddress(emailid));
            }
            
            //message.Bcc.Add(new MailAddress("nirajborwal@gmail.com"));
            message.Bcc.Add(new MailAddress("shital.malve@pointmatrix.com"));

            message.Subject = strSubject;
            message.Body = strEmailBody;
            message.IsBodyHtml = true;
            message.Priority = MailPriority.High;
            SmtpClient client = new SmtpClient();

            
                client.Credentials = new System.Net.NetworkCredential(Mailusername, Mailpassword);

            client.Port = 587;
            client.EnableSsl = true;

            client.Host = smptserver;
            client.Send(message);

        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
            Response.Write(ex.StackTrace);
        }
        finally
        {
            message.Dispose();
        }
        
    }
}