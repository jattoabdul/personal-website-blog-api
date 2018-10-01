export const emailTemplate = {
  /**
   *
   * @param  {string} email
   * @param  {string} hash
   *
   * @return {string} template
   */
  resetPassword(email, hash) {
    const template =
    `<div style="margin: -0.5em;
    padding-top: 0.1em;
    font-family: 'Futura', sans-serif;
    height: 100vh;
    background: rgba(255, 255, 255, 1);">
      <div style="background: rgba(234, 82, 111, 1);
      margin: -0.8em 0.2em;
      padding: 0em 1em;
      text-align: center;
      font-size: 2em;
      color: white;">
        <p style="padding: 0.25em 10em;">Firdaus Amasa</p>
      </div>
      <div style="padding: 1px 10em;">
        <h1>Hi ${email}!,</h1>
        <p style="font-size: 1.4em;">You recently requested
        to reset your password for your Firdaus Amasa Blog account.
        Click the button below to reset it.</p>
        <a href="https://firdausamasa.herokuapp.com/updatepassword/${hash}" 
        style="color: white;
        text-decoration: none;
        text-align: center;
        margin: auto;
        display: block;
        background: rgba(234, 82, 111, 1);
        width: 15em;
        padding: 1em;
        border-radius: 3px;
        border: ridge #EEEEEE 1px;
        box-shadow: 0px 0px 3px grey;" 
        onmouseover = "this.style.borderWidth = '2px'"
        onmouseout  = "this.style.borderWidth = '1px'">Reset your password</a>
        <p style="font-size: 1em;
        color: grey;">If you did not request a password reset,
        please ignore this email or reply to let us know.
        The password reset is only valid for the next 1 hour.</p>
        <p style="font-size: 1.25em;">Thanks, <br> POSTiT Dev Team</p>
        <hr>
        <p>If you are having trouble clicking the password reset button,
        copy and paste the url below into your web browser.</p>
        <a href="https://firdausamasa.herokuapp.com/updatepassword/${hash}">
        https://firdausamasa.herokuapp.com/updatepassword/${hash}
        </a>
      </div>
      <div style="left: 0;
      padding-top: 0.1em;
      font-family: 'Futura', sans-serif;
      background: #e0f2f1;">
        <div style="position: absolute;
        bottom: 0;
        text-align: center;
        width: 100%;
        background: azure;
        color: #607D8B;">
          <p>&copy; 2017 | Firdaus Amasa | All Rights reserved.</p>
        </div>
    </div>`;
    return template;
  },

  /**
   *
   * @param  {string} fullName
   * @param  {string} email
   * @param  {string} phoneNumber
   * @param  {string} clientSubject
   * @param  {string} company
   * @param  {string} message
   *
   * @return {string} template
   */
  contactMe(fullName, email, phoneNumber, clientSubject, company, message) {
    const template = `<div style="margin: -0.5em;
    padding: 0 5em 0 5em;
    font-family: 'Futura', sans-serif;
    height: 100vh;
    color: rgba(0, 0, 0, 1);
    background: rgba(255, 255, 255, 1);">
      <p style="
        padding: 0.5em 5em 0.5em 1em;
        font-size: 2em;
        margin-bottom: 2em;
        margin-right: 5em;
        text-align: left;
        width: 100%;
        background: rgba(234, 82, 111, 1);
        color: rgba(255, 255, 255, 1);">Firdaus Amasa Personal Website and Blog</p>
      <p><span style="font-weight: bold;
      ">From: </span>${fullName} &#60;${email}&#62;</p>
      ${!phoneNumber ? '' : `<p><span style="font-weight: bold;
      ">PhoneNumber: </span>${phoneNumber}</p>`}
      ${!company ? '' : `<p><span style="font-weight: bold;
      ">Company: </span>${company}</p>`}
      <p><span style="font-weight: bold;
      ">Subject: </span>${clientSubject}</p>
      <p><span style="font-weight: bold;
      ">Message Body: </span><br />${message}</p>

      <p>--</p>
      <p>This email was sent from a contact form on my Site (https://firdausamasa.com)</p>
    <div>`;

    return template;
  },

  /**
   *
   * @param  {string} email
   *
   * @return {string} template
   */
  subscriptionSuccess(email) {
    const template = `<div style="margin: -0.5em;
    padding: 0 5em 0 5em;
    font-family: 'Futura', sans-serif;
    height: 100vh;
    color: rgba(0, 0, 0, 1);
    background: rgba(255, 255, 255, 1);">
      <p style="
        padding: 0.5em 5em 0.5em 1em;
        font-size: 2em;
        margin-bottom: 2em;
        margin-right: 5em;
        text-align: left;
        width: 100%;
        background: rgba(234, 82, 111, 1);
        color: rgba(255, 255, 255, 1);">
        Firdaus Amasa Personal Website and Blog
      </p>
      <h3>Thank you and welcome to the Family!</h3>
      <p>Hi, You have successfully subscribed to our monthly newsletter with this ${email}</p>
      <p> To ensure you receive our newsletters, please add us to your address book </p>
      <br />
      <p> If you have any questions, please do not hesitate to shoot us an <a href="mailto:me@firdausamasa.com">email</a> </p>

      <p>---</p>
      <p>This email was sent to you from my Site (https://firdausamasa.com)</p>
    <div>`;

    return template;
  }
};
