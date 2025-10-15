export interface IBigtosSendOptions {
  mobileno: string | string[];
  msg: string;
  type?: "Text" | "Image" | "File" | "Template" | string;
  file?: string;
  templateJson?: Record<string, any>;
  throttleMs?: number;
}

export interface IBigtosService {
  sendMessage(opts: IBigtosSendOptions): Promise<any>;

  // common helpers
  sendText(mobileno: string | string[], msg: string): Promise<any>;
  sendImage(mobileno: string | string[], caption: string, fileUrl: string): Promise<any>;
  sendFile(mobileno: string | string[], caption: string, fileUrl: string): Promise<any>;
  sendTemplate(mobileno: string | string[], templateJson: Record<string, any>): Promise<any>;

  // admin/utility
  getHistory(): Promise<any>;
  getStatus(): Promise<any>;
  getCredit(): Promise<any>;
  getAccountInfo(): Promise<any>;

  // legacy convenience: older code calls sendOTP directly
  sendOTP: (mobileno: string, otpCode: string) => Promise<any>;

  // legacy / convenience aliases used through the codebase
  sendTextImage: (mobileno: string | string[], msg: string, file?: string) => Promise<any>;
  sendCourseEnrollmentNotification: (mobileno: string, courseName: string) => Promise<any>;
  sendQuizCertificateNotification: (mobileno: string, quizName: string, score: number) => Promise<any>;
  sendMasterclassBookingNotification: (mobileno: string, masterclassName: string, scheduledAt: string) => Promise<any>;
  sendResearchServiceNotification: (mobileno: string, serviceName: string, status: string) => Promise<any>;
  sendVoiceUpdate: (mobileno: string, userName: string, voiceTitle: string, updateTitle: string) => Promise<any>;
}

export default IBigtosService;
