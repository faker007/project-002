export interface LoginCoreLoginModeTypes {
  setSignInMode: any;
  emailMode: any;
  handleSubmit: any;
  handleEmailChange: any;
  handlePasswordChange: any;
  errorMsg: any;
  setEmailMode: any;
}
export interface LoginCoreSignInModeTypes {
  emailMode: any;
  errorMsg: any;
  commuDetail: any;
  setCommuDetail: any;
  setSignInMode: any;
  setEmailMode: any;
  handleSubmit: any;
  handleEmailChange: any;
  handlePasswordChange: any;
}
export interface LoginModeTypes {
  loginMode: boolean;
  setLoginMode: React.Dispatch<React.SetStateAction<boolean>>;
}
