import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n

  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          IFramAddressLink: "iFram Address Link",
          LinkOfIFrame: "Link Of IFrame",
          CurrentWorkPlace: "Current Work Place",
          Biography: "Biography",
          gender: "gender",
          pionts: "pionts",
          Event: "Event",
          AddNewEvent: "Add New Event",
          UpdateTheEvent: "Update The Event",
          ArabicName: "Arabic Name",
          EnglishName: "English Name",
          EventNameInArabic: "Event Name in Arabic",
          EventNameInEnglish: "Event Name in English",
          EventDescriptionInArabic: "Event Description in Arabic",
          EventDescriptionInEnglish: "Event Description in English",
          EventAdress: "Event Adress",
          LocationOfTheEvent: "Location Of The Event",
          LatitudeOfLocation: "Latitude Of Location",
          LongitudeOfLocation: "Longitude Of Location",
          NumberOfTickets: "Number Of Tickets",
          PriceOfTicket: "Price Of Ticket",
          EventZoomLink: "Event Zoom Link",
          ArabicDescription: "Arabic Description",
          EnglishDescription: "English Description",
          StartDayOfEvent: "Start Day of Event",
          EndDayOfEvent: "End Day of Event",
          StartSellTicketDay: "Start Sell Ticket Day",
          EndSellTicketDay: "End Sell Ticket Day",
          TotalPrice: "Total Price",
          WillThisEventBeOnline: "Will this event be online?",
          WillThisEventBeOffline: "Will this event be offline?",
          EventImages: "Event Images",
          UploadPrimeImage: "Upload Prime Image",
          UploadEventImages: "Upload Event Images",
          EventDays: "Event Days",
          Day: "Day",
          Address: "Address",
          AddressGpsLink: "Address Gps Link",
          Latitude: "Latitude",
          longitude: "longitude",
          EventStartDay: "Event Start Day",
          NoOfTickets: "No Of Tickets",
          Price: "Price",
          LinkZoom: "Link Zoom",
          WillThisDayBeOnline: "Will this day be online?",
          WillThisDayBeOffline: "Will this day be offline?",
          SpeakersRatings: "Speakers Ratings",
          SendMessage: "Send Message",

          StartSurvey: "Start Survey",
          StartQuestions: "Start Questions",
          SpeakerRating: "Speaker Rating",
          AreYouSure: " Are you sure you want to proceed with ",
          SpeakerQuestions: "Speaker Questions",
          SpeakerQuestion: "Speaker Question",
          Survey: "Survey",
          NightEvent: "Night Event",
          YouHaveStarted: "You have Started a",

          Speaker: "Speaker",
          SpeakerID: "Speaker ID",
          StartSpeakerTime: "Start Speak Time",
          EndSpeakerTime: "End Speak Time",
          RemoveSpeaker: "Remove Speaker",
          Details: "Details",
          AddSpeaker: "Add Speaker",
          AddQuestion: "Add Question",
          EventDayQuestions: "Event Day Questions",
          Question: "Question",
          ArabicQuestion: "Arabic Question",
          EnglishQuestion: "English Question",
          Point: "Point",
          ArabicAnswer: "Arabic Answer",
          EnglishAnswer: "English Answer",
          IsTrueAnswer: "Is True Answer?",
          RemoveAnswer: "Remove Answer",
          AddAnswer: "Add Answer",
          RemoveQuestion: "Remove Question",
          EventDayVideos: "Event Day Videos",
          UploadVideo: "Upload Video",
          RemoveDay: "Remove Day",
          AddDay: "Add Day",
          UpdateEvent: "Update Event",
          EventDaySpeakers: "Event Day Speakers",
          Send: "Send",
          Choose: "Choose",
          Clear: "Clear",
          Language: "Lang",
          AllUsers: "All Users",
          Users: "Users",
          Speakers: "Speakers",
          Events: "Events",
          Upcoming: "Upcoming",
          Running: "Running",
          Ended: "Ended",
          AllEnteredEvents: "All Entered Events",
          AddEvent: "Add Event",
          ID: "ID",
          NoEventsFound: "No Events found",
          Count: "Count",
          Actions: "Actions",
          EventsStates: "Events States",
          EndDay: "End Day",
          StartDay: "Start Day",
          SearchByName: "Search By Name",
          SearchByEmail: "Search By Email",
          SearchByDiscribtion: "Search By Discribtion",
          Discribtion: "Discribtion",
          Name: "Name",
          Email: "Email",
          AllRegisteredAsUsers: "All Registered As Users",
          NoUsersFound: "No Users found",
          PhoneNumber: "Phone Number",
          SearchByPhoneNumber: "Search By Phone Number",
          Active: "Active",
          Yes: "Yes",
          No: "No",
          AllRegisteredAsSpeakers: "All Registered As Speakers",
          SendMessages: "Send Messages",
          Description: "Description",
          QuestionsAnswers: "Questions & Answers",
          Male: "Male",
          Female: "Female",
          DateOfBirth: "Date Of Birth",
          Resourses: "Resourses",
          SelectSpeakers: "Select Speakers",
          SelectUsers: "Select Users",
          EnterMessage: "Enter Message",
          Confirmed: "Confirmed",
          Notification: "Notification",
          Confirmation: "Confirmation",
          acceptRemoving: "You have accepted the removing",
          acceptBlockChange: "You have accepted changing the block status",
          ConfirmationMessages: {
            removeDay: "Are you sure you want to remove this day?",
            removeQuestion: "Are you sure you want to remove this question?",
            removeSpeaker:
              "Are you sure you want to remove this Speaker from the event?",
            removeAnswer:
              "Are you sure you want to remove this answer from the question?",
            blockUser: "Are you sure you want to block this user?",
            unBlockUser: "Are you sure you want to unblock this user?",
            delete: "Are you sure you want to delete this Admin?",
            deleteSpeaker: "Are you sure you want to delete this Speaker?",
            deleteUser: "Are you sure you want to delete this User?",


          },
          rejectRemoving: "Rejected",
          rejectRemovingMessage: "You have rejected the removing",
          rejectBlockChange: "You have rejected changing the block status",
          UserUnBlocked: "User has been unblocked successfully",
          UserBlocked: "User has been blocked successfully",
          Support: "Support",
          Blocked: "Blocked",
          ContactUs: "Contact Us",
          PromoCodes: "Promo Codes",
          DeleteCodeConfirm: "Are you sure you want to delete this code?",
          Code: "Code",
          DiscountPercentage: "Discount Percentage",
          ExpirationDate: "Expiration Date",
          LimitNumber: "Limit Number",
          AddPromoCode: "Add Promo Code",
          CreateNewPromoCode: "Create New Promo Code",
          AffiliateCodes: "Affiliate Codes",
          AddAffiliateCodes: "Add Affiliate Code",
          CreateNewAffiliateCode: "Create New Affiliate Code",
          AllSupportMessages: "All Support Messages",
          Title: "Title",
          Message: "Message",
          Content: "Content",
          SupportDetails: " Details",
          SupportMessage: "Message",
          ContactMessages: "Contact Messages",
          AllContactMessages: "All Contact Us Messages",
          EventUpdatedSucc: "Event has been updated successfully",
          Updated: "Updated",
          Created: "Created",
          CreatedSucc: "Event has been created successfully",
          DeleteEventConfirm: "Are you sure you want to delete this event?",
          Success: "Success",
          EventDeletedSucc: "Event has been deleted successfully",
          LandingSpeakers: "Speakers",
          LandingSponsers: "Sponsers",
          LandingText: "Page Text",
          Cancel: "Cancel",
          Save: "Save",
          CreateNewSpeaker: "Create New Speaker",
          CreateNewSponsor: "Create New Sponsor",
          EditSponsor: "Edit Sponsor",
          EditSpeaker: "Edit Speaker",
          UploadImage: "Upload Image",
          title: "Title",
          titleAr: "Title Arabic",
          titleEn: "Title English",
          nameAr: "Name Arabic",
          nameEn: "Name English",
          EditText: "Edit Text",
          welcomeDescriptionAr: "Welcome Description Arabic",
          welcomeDescriptionEn: "Welcome Description English",
          photoAndVideoDescriptionAr: "Photo And Video Description Arabic",
          photoAndVideoDescriptionEn: "Photo And Video Description English",
          SponserDeletedSucc: "Sponsor has been deleted successfully",
          AddSponser: "Add Sponsor",
          LandingPage: "Landing Page",
          DeleteSponserConfirm: "Are you sure you want to delete this sponsor?",
          DeleteSpeakerConfirm: "Are you sure you want to delete this speaker?",
          DeletePromoCodeConfirm: "Are you sure you want to delete this code?",
          LandingAboutUs: "About Us",
          descriptionAr: "Description Arabic",
          descriptionEn: "Description English",
          SpeakerDeletedSucc: "Speaker has been deleted successfully",
          UserDeletedSucc: "User has been deleted successfully",
          Notifications: "Notifications",
          MarkAllAsRead: "Mark all as read",
          EventOrganizer: "Event Organizer",
          PleaseAnswerTheseQuestions: "Please answer these questions !",
          Questions: "Questions",
          SaveAndClose: "Save and Close",
          AreYouGoingToTheNightEvent: "Are you going to the night event?",
          pleaseRateSpeakers: "Please rate the speakers",
          Vote: "Vote",
          ChooseYourFavoriteSpeaker: "Choose your favorite speaker",
          Review: "Review",
          PleaseGiveUsYourReview: "Please give us your review",
          Submit: "Submit",
          PleaseWeNeedYourSurvey: "Please we need your survey",
          NewUpdateInSpeakersRating: "New Update in Speakers Rating",
          WinnerSpeaker: "Winner Speaker",
          TheWinnerIs: "The winner is",
          With: "With",
          Votes: "Votes",
          YourFeedBackIsImportant: "Your FeedBack Is Important",
          newUpdateInCommunity: "New Update in Community",
          SurveySent: "Survey Sent",
          ThanksForYourFeedback: "Thanks for your feedback",
          AnswersSubmittedSuccessfully: "Answers Submitted Successfully",
          AnswersSent: "Answers Sent",
          YourPoints: "Your Points",
          YourTotalPoints: "Your Total Points",
          Close: "Close",
          answerSent: "Answer Sent",
          YourResponseHasBeenSubmittedSuccessfully:
            "Your Response Has Been Submitted Successfully",
          YourRateHasBeenSubmittedSuccessfully:
            "Your Rate Has Been Submitted Successfully",
          RateSent: "Rate Sent",
          MessageSent: "Message Sent",
          MessageSentSuccessfullyWeWillContactYou:
            "Sent Successfully We Will Contact You",
          BookingDatesSent: "Booking Dates has been sent",
          BookingDatesMessageSent:
            "Booking Dates Message has been sent successfully",
          Attendance: "Attendance",
          Departure: "Departure",
          BookingTicket: "Booking Ticket",
          Confirm: "Confirm",
          Remove: "Remove",
          CityTo: "City to",
          CityFrom: "City from",
          Answer: "Answer",
          Answers: "Answers",
          QuestionEn: "Question in English",
          QuestionAr: "Question in Arabic",
          AddNewAnswerEn: "Answer in English",
          AddNewAnswerAr: "Answer in Arabic",
          Correct: "Correct",
          False: "False",
          AddNewQuestion: "Add New Question",
          QuestionAdded: " Question Added",
          QuestionAddedSuccessfully: "You Added Question Successfully",
          QuestionDeleted: "Question Deleted",
          QuestionDeletedSuccessfully: "You Deleted Question Successfully",
          QuestionsEn: "Questions in English",
          QuestionsAr: "Questions in Arabic",
          Role: "Role",
          Selected: "Selected",
          UserPage: "User Page",
          AdminPage: "Admin Page",
          Admins: "Admins",
          AddAdmin: "Add Admin",
          premissions: "premissions",
          NoPremissions: "No Premissions",
          ConfirmPassword: "Confirm Password",
          SelectRoles: "Select Roles",
          UploadProfilePic: "Upload Profile Pic",
          EventReports: "Event Reports",
          UserAttendance: "User Attendance",
          WhoBoughtThisEvent: "Who Bought This Event",
          NightEventUsers: "Night Event Users",
          AllRegisteredAsAdmins: "All Registered As Admins",
          NameAr: "Name Arabic",
          NameEn: "Name English",
          UsingCount:"Using Count",
          Password: "Password",
          phone: "Phone",
          Permissions: "Permissions",
          EventReport: "Event Report",
          AdminDeletedSucc: "Admin has been deleted successfully",
          Error: "Error",
          fillAllFields: "Please fill all fields",
        },
      },
      ar: {
        translation: {
          fillAllFields: "يرجى ملء جميع الحقول",
          Error: "خطأ",
          AdminDeletedSucc: "المشرف تم حذفه بنجاح",
          Cancel: "الغاء",
          LandingAboutUs: "من نحن",
          descriptionAr: "وصف بالعربي",
          descriptionEn: "وصف بالانجليزي",
          SpeakerDeletedSucc: "المتحدث تم حذفه بنجاح",
          UserDeletedSucc: "الحساب تم حذفه بنجاح",
          DeleteSponserConfirm: "هل انت متأكد من حذف هذا الممول؟",
          DeleteSpeakerConfirm: "هل انت متأكد من حذف هذا المتحدث؟",
          DeletePromoCodeConfirm: "هل انت متأكد من حذف هذا الكود",
          AddSponser: "اضافة ممول",
          SponserDeletedSucc: "الممول تم حذفه بنجاح",
          welcomeDescriptionAr: "وصف الترحيب بالعربي",
          welcomeDescriptionEn: "وصف الترحيب بالانجليزي",
          photoAndVideoDescriptionAr: "وصف الصور والفيديو بالعربي",
          photoAndVideoDescriptionEn: "وصف الصور والفيديو بالانجليزي",
          LandingPage: "الصفحة الرئيسية",
          title: "العنوان",
          titleAr: "العنوان عربي",
          titleEn: "العنوان انجليزي",
          nameAr: "الاسم عربي",
          nameEn: "الاسم انجليزي",
          UsingCount:"عدد مرات الاستخدام",
          UploadImage: "رفع الصورة",
          Save: "حفظ",
          EditText: "تعديل النص",
          CreateNewSpeaker: "إنشاء متحدث",
          EditSpeaker: "تعديل متحدث",
          CreateNewSponsor: "إنشاء راع",
          EditSponsor: "تعديل راع",
          LandingSpeakers: "المتحدثون",
          LandingSponsers: "الرعاة",
          LandingText: "نص الصفحة",
          IFramAddressLink: "رابط IFrame",
          LinkOfIFrame: "رابط IFrame",
          Success: "نجاح",
          EventDeletedSucc: "تم حذف الحدث بنجاح",
          DeleteEventConfirm: "هل انت متأكد من حذف هذا الحدث؟",
          Created: "تم الانشاء",
          EventCreatedSucc: "تم انشاء الحدث بنجاح",
          Updated: "تم التحديث",
          EventUpdatedSucc: "تم تحديث الحدث بنجاح",
          ContactMessages: "رسائل التواصل",
          AllContactMessages: "جميع رسائل التواصل",
          SupportMessage: "الرسالة ",
          SupportDetails: " تفاصيل ",
          Title: "العنوان",
          Content: "المحتوى",
          Blocked: "محظور",
          AllSupportMessages: "جميع رسائل الدعم",
          Support: "الدعم",
          ContactUs: "اتصل بنا",
          PromoCodes: "اكواد الخصم",
          Code: "الكود",
          DiscountPercentage: "نسبة الخصم",
          ExpirationDate: "تاريخ الانتهاء",
          LimitNumber: "عدد الاستخدام",
          AddPromoCode: "اضافة كود جديد",
          CreateNewPromoCode: "اضافة كود جديد",
          DeleteCodeConfirm : "هل انت متأكد من حذف هذا الكود؟",
          AffiliateCodes: "اكواد الشركاء",
          AddAffiliateCodes: "اضافة كود شريك",
          CreateNewAffiliateCode: "اضافة كود شريك",
          UserUnBlocked: "تم فك الحظر على المستخدم بنجاح",
          UserBlocked: "تم حظر المستخدم بنجاح",
          rejectRemoving: "تم الرفض",
          rejectRemovingMessage: "لقد قمت بالرفض",
          acceptRemoving: "لقد قمت بالموافقة على الحذف",
          ConfirmationMessages: {
            removeDay: "هل أنت متأكد أنك تريد إزالة هذا اليوم؟",
            removeQuestion: "هل أنت متأكد أنك تريد إزالة هذا السؤال؟",
            removeSpeaker: "هل أنت متأكد أنك تريد إزالة هذا المتحدث من الحدث؟",
            removeAnswer: "هل أنت متأكد أنك تريد إزالة هذه الإجابة من السؤال؟",
            blockUser: "هل أنت متأكد أنك تريد أزالة هذا المستخدم؟",
            unBlockUser: "هل أنت متأكد أنك تريد تفعيل هذا المستخدم؟",
            delete: "هل أنت متأكد أنك تريد أزالة هذا المدير",
            deleteSpeaker: "هل أنت متأكد أنك تريد أزالة هذا المتحدث",
            deleteUser: "هل أنت متأكد أنك تريد أزالة هذا الحساب",


          },
          Confirmation: "التأكيد",
          Confirmed: "تم التأكيد",
          rejectBlockChange: "تم الرفض على تغيير حالة الحظر",
          acceptBlockChange: "لقد قمت بالموافقة على تغيير حالة الحظر",

          Notification: "الإشعار",
          SelectUsers: "اختر المستخدمين",
          SelectSpeakers: "اختر المحاضرين",
          CurrentWorkPlace: "مكان العمل الحالي",
          Male: "ذكر",
          Female: "انثى",
          gender: "جنس",
          pionts: "النقاط",
          Event: "الفعالية",
          UpdateTheEvent: "تحديث الفعالية",
          DateOfBirth: "تاريخ الميلاد",
          ArabicName: "الاسم بالعربية",
          EnglishName: "الاسم بالإنجليزية",
          EventZoomLink: "رابط الفعالية",
          EventNameInArabic: "اسم الفعالية بالعربية",
          EventNameInEnglish: "اسم الفعالية بالإنجليزية",
          EventDescriptionInEnglish: "وصف الفعالية بالإنجليزية",
          EventDescriptionInArabic: "وصف الفعالية بالعربية",
          PriceOfTicket: "سعر التذكرة",
          EventAdress: "عنوان الفعالية",
          LocationOfTheEvent: "موقع الفعالية",
          LatitudeOfLocation: "خط العرض",
          LongitudeOfLocation: "خط الطول",
          NumberOfTickets: "عدد التذاكر",
          ArabicDescription: "الوصف بالعربية",
          EnglishDescription: "الوصف بالإنجليزية",
          StartDayOfEvent: "بداية الفعالية",
          EndDayOfEvent: "نهاية الفعالية",
          StartSellTicketDay: "بداية بيع التذاكر",
          EndSellTicketDay: "نهاية بيع التذاكر",
          TotalPrice: "السعر الكلي",
          WillThisEventBeOnline: "هل ستكون الفعالية عبر الإنترنت؟",
          WillThisEventBeOffline: "هل ستكون الفعالية حضورًا شخصيًا؟",
          EventImages: "صور الفعالية",
          UploadPrimeImage: "رفع الصورة الرئيسية",
          UploadEventImages: "رفع صور الفعالية",
          EventDays: "أيام الفعالية",
          Day: "يوم",
          Address: "العنوان",
          AddressGpsLink: "رابط GPS ",
          Latitude: "خط العرض",
          longitude: "خط الطول",
          EventStartDay: "يوم بداية الفعالية",
          NoOfTickets: "عدد البطاقات",
          Price: "السعر",
          LinkZoom: "رابط زوم",
          WillThisDayBeOnline: "هل اليوم للفعالية عبر الإنترنت؟",
          WillThisDayBeOffline: "هل اليوم للفعالية حضورًا شخصيًا؟",
          SpeakersRatings: "تقييمات المحاضرين",
          SendMessage: "ارسال رسالة",
          StartSurvey: "بدئ التقييم",
          StartQuestions: "ابدأ أسئلة",
          SpeakerRating: "تقييم المحاضر",
          YouHaveStarted: "لقد بدئت",
          AreYouSure: "هل أنت متاكد من البدأ في",
          SpeakerQuestions: "ابدأ أسئلة المحاضر",
          SpeakerQuestion: " أسئلة المحاضر",
          Survey: "التقييم",
          NightEvent: " فعالية الليلية",
          EventDaySpeakers: "محاضرين اليوم",
          Speaker: "المحاضر",
          SpeakerID: "رقم المحاضر",
          StartSpeakerTime: "وقت بدئ المحاضر",
          EndSpeakerTime: "وقت نهاية المحاضر",
          RemoveSpeaker: "ازالة المحاضر",
          Details: "تفاصيل",
          AddSpeaker: "اضافة محاضر",
          EventDayQuestions: "أسئلة اليوم",
          EnterMessage: "اكتب رسالة",
          Question: "السؤال",
          ArabicQuestion: "السؤال بالعربية",
          EnglishQuestion: "السؤال بالإنجليزية",
          Point: "نقطة",
          ArabicAnswer: "الجواب بالعربية",
          EnglishAnswer: "الجواب بالإنجليزية",
          IsTrueAnswer: "هل هو الجواب الصحيح؟",
          RemoveAnswer: "ازالة الجواب",
          AddAnswer: "اضافة جواب",
          AddQuestion: "اضافة سؤال",
          RemoveQuestion: "ازالة السؤال",
          EventDayVideos: "فيديوهات اليوم",
          UploadVideo: "رفع فيديو",
          RemoveDay: "ازالة يوم",
          QuestionsAnswers: "الأسئلة ",
          AddDay: "اضافة يوم",
          UpdateEvent: "تحديث الفعالية",
          Send: "ارسال",
          Choose: "اختر",
          Clear: "مسح",
          Language: "اللغة",
          AllUsers: "كل المستخدمين",
          Users: "المستخدمين",
          Speakers: "المحاضرين",
          Events: "الفعاليات",
          Upcoming: "قادمة",
          Running: "جارية",
          Ended: "منتهية",
          AllEnteredEvents: "كل الفعاليات المدخلة",
          AddEvent: "اضافة فعالية",
          ID: "رقم",
          NoEventsFound: "لم يتم العثور على الفعاليات",
          Count: "عدد",
          Actions: "الاجراءات",
          EventsStates: "حالات الفعاليات",
          EndDay: "يوم النهاية",
          StartDay: "يوم البدئ",
          SearchByName: "بحث عن طريق الاسم",
          SearchByEmail: "بحث عن طريق البريد الالكتروني",
          SearchByDiscribtion: "بحث عن طريق الوصف",
          Discribtion: "الوصف",
          Name: "الاسم",
          Email: "البريد الالكتروني",
          AllRegisteredAsUsers: "كل المسجلين كمستخدمين",
          NoUsersFound: "لم يتم العثور على المستخدمين",
          PhoneNumber: "رقم الهاتف",
          SearchByPhoneNumber: "بحث عن طريق رقم الهاتف",
          Active: "نشط",
          Yes: "نعم",
          No: "لا",
          AllRegisteredAsSpeakers: "كل المسجلين كمحاضرين",
          Description: "الوصف",
          AddNewEvent: "اضافة فعالية جديدة",
          Biography: "السيرة الذاتية",
          Resourses: "الموارد",
          Notifications: "الاشعارات",
          MarkAllAsRead: "جعل جميع الاشعارات كمقروءة",
          EventOrganizer: "منظم الحدث",
          PleaseAnswerTheseQuestions: "يرجى الاجابة على هذه الأسئلة !",
          Questions: "الأسئلة",
          SaveAndClose: "حفظ واغلاق",
          AreYouGoingToTheNightEvent: "هل أنت ذاهب في حدث الليل؟",
          pleaseRateSpeakers: "يرجى تقييم المحاضريين",
          Vote: "التقييم",
          ChooseYourFavoriteSpeaker: "اختر المحاضر المفضل لك",
          Review: "مراجعة",
          PleaseGiveUsYourReview: "يرجى تقديم مراجعتك",
          Submit: "تقديم",
          PleaseWeNeedYourSurvey: " نحتاج لتقييمك من فضلك",
          NewUpdateInSpeakersRating: "تحديث جديد في تقييم المحاضرين",
          WinnerSpeaker: "المحاضر الفائز",
          TheWinnerIs: "الفائز هو",
          With: "مع",
          Votes: "تصويت",
          YourFeedBackIsImportant: "تعليقك هو مهم جدا",
          newUpdateInCommunity: "تحديث جديد في المجتمع",
          SurveySent: "تم ارسال الاستبيان",
          ThanksForYourFeedback: "شكرا لك على رأيك",
          AnswersSent: "تم ارسال الاجابات",
          AnswersSubmittedSuccessfully: "تم تقديم الاجابات بنجاح",
          YourPoints: "نقاطك",
          YourTotalPoints: "اجمالي نقاطك",
          Close: "اغلاق",
          answerSent: "تم الرد",
          YourResponseHasBeenSubmittedSuccessfully: "تم تقديم الرد بنجاح",
          YourRateHasBeenSubmittedSuccessfully: "تم تقديم التقييم بنجاح",
          RateSent: "تم ارسال التقييم",
          MessageSent: "تم ارسال الرسالة",
          MessageSentSuccessfullyWeWillContactYou: "تم بنجاح سيتم التواصل معك",
          BookingDatesSent: "تم ارسال تواريخ الحجز",
          BookingDatesMessageSent: "تم ارسال رسالة تواريخ الحجز بنجاح",
          Attendance: "الحضور",
          Departure: "المغادرة",
          BookingTicket: "حجز التذكرة",
          Confirm: "تأكيد",
          Remove: "ازالة",
          CityTo: "الى مدينة",
          CityFrom: "من مدينة",
          Answer: "الاجابة",
          Answers: "الاجابات",
          QuestionEn: "السؤال باللغة الانجليزية",
          QuestionAr: "السؤال باللغة العربية",
          AddNewAnswerEn: "الاجابة باللغة الانجليزية",
          AddNewAnswerAr: "الاجابة باللغة العربية",
          Correct: "صحيح",
          False: "خاطئ",
          AddNewQuestion: "اضافة سؤال جديد",
          QuestionAdded: "تمت الاضافة",
          QuestionAddedSuccessfully: "تمت اضافة السؤال بنجاح",
          QuestionDeleted: "تم الحذف",
          QuestionDeletedSuccessfully: "تم حذف السؤال بنجاح",
          QuestionsEn: "الأسئلة باللغة الانجليزية",
          QuestionsAr: "الأسئلة باللغة العربية",
          Role: "وظيفة",
          Selected: "مختارة",
          UserPage: "صفحة المستخدم",
          AdminPage: "صفحة المديرين",
          Admins: "المديرين",
          AddAdmin: "اضافة مدير",
          premissions: "الصلاحيات",
          NoPremissions: "لا صلاحيات",
          ConfirmPassword: "تأكيد كلمة المرور",
          SelectRoles: "تحديد الصلاحيات",
          UploadProfilePic: "تحميل صورة الملف الشخصي",
          EventReports: "تقارير الحدث",
          UserAttendance: "المستخدمين الحاضرين",
          WhoBoughtThisEvent: "من اشترى هذا الحدث",
          NightEventUsers: "المستخدمين في الليل",
          AllRegisteredAsAdmins: "جميع المستخدمين المسجلين كمديرين",
          NameAr: "الاسم باللغة العربية",
          NameEn: "الاسم باللغة الانجليزية",
          phone: "الهاتف",
          Password: "كلمة المرور",
          Permissions: "الصلاحيات",
          EventReport: "تقارير الحدث",
        },
      },
    },
  });

export default i18n;
