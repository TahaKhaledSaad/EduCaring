export const BASE = "https://educarringapi.com/api";

// Auth
export const USER_REJISTER = "Auth/UserRegister";
export const SPEAKER_REGISTER = "Auth/SpeakerRegister";
export const BLOCK_USER = "Auth/BlockUser";
export const UNBLOCK_USER = "Auth/UnBlockUser";
export const LOGIN = "Auth/Login";

// Events
export const ADD_EVENT = "Event";
export const GET_EVENT = "Event/GetAll";
export const GET_EVENT_DAY_ATTENDANCE = "Event/EventDayAttentanceReport";
export const Delete_Event_Image = "Event/DeleteEventImage";

// Users && Speakers
export const GET_USERS = "Dashboard/GetAllUsers";
export const GET_SPEAKERS = "Dashboard/GetAllSpeakers";
export const GET_ADMINS = "Dashboard/GetAllSuperAdmin";
export const GET_NIGHT_USERS = "Dashboard/GetNightEventUsers";
export const GET_USERS_FOR_EVENTDAY = "Dashboard/GetUsersForEventDay";
export const GET_EVENTDAY_REVIEW = "Dashboard/GetEventDayReview";
export const DELETE_USER = "Auth/DeleteUser";
export const ADD_SUPER_ADMIN = "Auth/SuperAdminRegister";

// Upload
export const UPLOAD = "Upload";
export const EVENT_GALLERY_RESORSES = "EventGalleryResorses";
export const EVENT_RESORSES = "EventResorses";

// SpeakersRatings
export const BEST_SPEAKERS = "Question/GetWinnnerSpeaker";
export const EVENT_DAY_SPEAKERS_DATA = "EventDaySpeaker/GetEventDaySpeakerData";
export const GET_ALL_SPEAKERS_BY_EVENTDAY =
  "Dashboard/GetAllSpeakersByEventDay";
// Community
export const COMMUNITY = "Community";
export const PRIVATE_MESSAGES = "Community/GetPrivateByUserId";

// Notifications
export const NIGHT_EVENT = "Notification/ForNightEvent";
export const SPEAKERS_RATING = "Notification/ForEventDaySpeakerRate";
export const SURVEY = "Notification/ForEventDaySurvey";
export const QUESTION = "Notification/ForEventDayQuestion";
export const SPEAKER_QUESTION = "Notification/ForEventDaySpeakerQuestion";

// Support, ContactUs
export const SUPPORT = "ContactUs/GetSupport";
export const CONTACT_US = "ContactUs/GetContactUs";

// LandingPage pages
export const LANDING_TEXT = "LandingPage/GetLandingTextForDash";
export const LANDING_SPONSERS = "LandingPage/GetSponsersForDash";
export const LANDING_SPEAKERS = "LandingPage/GetLandingSpeakerForDash";
export const LANDING_ABOUT_US = "MainData/GetAboutUsForDash";

// LandingPage Actions
export const LANDING_SPEAKER_CREATE = "LandingPage/AddLandingSpeaker";
export const LANDING_SPEAKER_EDIT = "LandingPage/UpdateLandingSpeaker";
export const LANDING_SPEAKER_DELETE = "LandingPage/DeleteLandingSpeaker";

export const LANDING_SPONSER_CREATE = "LandingPage/AddSponser";
export const LANDING_SPONSER_EDIT = "LandingPage/UpdateSponser";
export const LANDING_SPONSER_DELETE = "LandingPage/DeleteSponser";
export const LANDING_TEXT_UPDATE = "LandingPage/AddLandingText";
export const LANDING_ABOUT_US_UPDATE = "MainData/AddAboutUs";

// Promo Codes
export const GET_All_PROMO_CODES = "PromoCode/GetAllPromoCode";
export const ADD_PROMO_CODE = "PromoCode/AddPromoCode";
export const DELETE_PROMO_CODE = "PromoCode/DeletePromoCode";
export const CHECK_PROMO_CODE = "PromoCode/CheckPromoCode";
export const UPDATE_PROMO_CODE = "PromoCode/UpdatePromoCode";
