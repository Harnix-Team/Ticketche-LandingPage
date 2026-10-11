"use client";

// Point d'entree unique des icones du site : importer d'ici, jamais de "lucide-react" directement.
// Les icones qui existent dans lucide-animated s'animent au survol de leur bouton, lien ou tuile ;
// les autres restent les icones Lucide fixes. Pour en animer une de plus : scripts/add-animated-icons.mjs.

import { animated } from "@/components/icons/animated-icon";
import { ActivityIcon } from "@/components/icons/animated/activity";
import { ArrowLeftIcon } from "@/components/icons/animated/arrow-left";
import { ArrowRightIcon } from "@/components/icons/animated/arrow-right";
import { ArrowUpRightIcon } from "@/components/icons/animated/arrow-up-right";
import { CalendarDaysIcon } from "@/components/icons/animated/calendar-days";
import { CarIcon } from "@/components/icons/animated/car";
import { CheckIcon } from "@/components/icons/animated/check";
import { ChevronDownIcon } from "@/components/icons/animated/chevron-down";
import { ChevronLeftIcon } from "@/components/icons/animated/chevron-left";
import { ChevronRightIcon } from "@/components/icons/animated/chevron-right";
import { CircleCheckIcon } from "@/components/icons/animated/circle-check";
import { ClockIcon } from "@/components/icons/animated/clock";
import { CompassIcon } from "@/components/icons/animated/compass";
import { CreditCardIcon } from "@/components/icons/animated/credit-card";
import { ExternalLinkIcon } from "@/components/icons/animated/external-link";
import { EyeIcon } from "@/components/icons/animated/eye";
import { EyeOffIcon } from "@/components/icons/animated/eye-off";
import { FileTextIcon } from "@/components/icons/animated/file-text";
import { FlameIcon } from "@/components/icons/animated/flame";
import { GraduationCapIcon } from "@/components/icons/animated/graduation-cap";
import { HeartIcon } from "@/components/icons/animated/heart";
import { HomeIcon } from "@/components/icons/animated/home";
import { IdCardIcon } from "@/components/icons/animated/id-card";
import { KeySquareIcon } from "@/components/icons/animated/key-square";
import { LayersIcon } from "@/components/icons/animated/layers";
import { LoaderCircleIcon } from "@/components/icons/animated/loader-circle";
import { LockIcon } from "@/components/icons/animated/lock";
import { MapPinIcon } from "@/components/icons/animated/map-pin";
import { MenuIcon } from "@/components/icons/animated/menu";
import { MessageCircleIcon } from "@/components/icons/animated/message-circle";
import { MoonIcon } from "@/components/icons/animated/moon";
import { PaletteIcon } from "@/components/icons/animated/palette";
import { PartyPopperIcon } from "@/components/icons/animated/party-popper";
import { PhoneIcon } from "@/components/icons/animated/phone";
import { PlusIcon } from "@/components/icons/animated/plus";
import { ReceiptTextIcon } from "@/components/icons/animated/receipt-text";
import { RouteIcon } from "@/components/icons/animated/route";
import { SearchIcon } from "@/components/icons/animated/search";
import { ShieldCheckIcon } from "@/components/icons/animated/shield-check";
import { SparklesIcon } from "@/components/icons/animated/sparkles";
import { SunIcon } from "@/components/icons/animated/sun";
import { TicketIcon } from "@/components/icons/animated/ticket";
import { TimerIcon } from "@/components/icons/animated/timer";
import { TrendingUpIcon } from "@/components/icons/animated/trending-up";
import { UploadIcon } from "@/components/icons/animated/upload";
import { UserIcon } from "@/components/icons/animated/user";
import { UsersIcon } from "@/components/icons/animated/users";
import { WalletIcon } from "@/components/icons/animated/wallet";
import { WifiIcon } from "@/components/icons/animated/wifi";
import { WrenchIcon } from "@/components/icons/animated/wrench";
import { XIcon } from "@/components/icons/animated/x";
import { ZapIcon } from "@/components/icons/animated/zap";

export const Activity = animated(ActivityIcon);
export const ArrowLeft = animated(ArrowLeftIcon);
export const ArrowRight = animated(ArrowRightIcon);
export const ArrowUpRight = animated(ArrowUpRightIcon);
export const CalendarDays = animated(CalendarDaysIcon);
export const Car = animated(CarIcon);
export const Check = animated(CheckIcon);
export const ChevronDown = animated(ChevronDownIcon);
export const ChevronLeft = animated(ChevronLeftIcon);
export const ChevronRight = animated(ChevronRightIcon);
export const CircleCheck = animated(CircleCheckIcon);
export const Clock = animated(ClockIcon);
export const Compass = animated(CompassIcon);
export const CreditCard = animated(CreditCardIcon);
export const ExternalLink = animated(ExternalLinkIcon);
export const Eye = animated(EyeIcon);
export const EyeOff = animated(EyeOffIcon);
export const FileText = animated(FileTextIcon);
export const Flame = animated(FlameIcon);
export const GraduationCap = animated(GraduationCapIcon);
export const Heart = animated(HeartIcon);
export const House = animated(HomeIcon);
export const IdCard = animated(IdCardIcon);
export const KeySquare = animated(KeySquareIcon);
export const Layers = animated(LayersIcon);
export const Loader2 = animated(LoaderCircleIcon);
export const LoaderCircle = animated(LoaderCircleIcon);
export const Lock = animated(LockIcon);
export const MapPin = animated(MapPinIcon);
export const Menu = animated(MenuIcon);
export const MessageCircle = animated(MessageCircleIcon);
export const Moon = animated(MoonIcon);
export const Palette = animated(PaletteIcon);
export const PartyPopper = animated(PartyPopperIcon);
export const Phone = animated(PhoneIcon);
export const Plus = animated(PlusIcon);
export const ReceiptText = animated(ReceiptTextIcon);
export const Route = animated(RouteIcon);
export const Search = animated(SearchIcon);
export const ShieldCheck = animated(ShieldCheckIcon);
export const Sparkles = animated(SparklesIcon);
export const Sun = animated(SunIcon);
export const Ticket = animated(TicketIcon);
export const Timer = animated(TimerIcon);
export const TrendingUp = animated(TrendingUpIcon);
export const Upload = animated(UploadIcon);
export const User = animated(UserIcon);
export const Users = animated(UsersIcon);
export const Wallet = animated(WalletIcon);
export const Wifi = animated(WifiIcon);
export const Wrench = animated(WrenchIcon);
export const X = animated(XIcon);
export const Zap = animated(ZapIcon);

export {
  Baby, Banknote, Bike, Briefcase, Building2, CalendarClock, CalendarPlus, Camera, ChartColumn, Church, CircleAlert,
  Clapperboard, ClipboardList, Coins, Drama, Dumbbell, FerrisWheel, Fuel, Globe, Handshake, Headset, Hotel, Images,
  Landmark, LocateFixed, LogOut, Mail, Map, Martini, MessageSquareText, Monitor, Motorbike, Music, Navigation,
  Paintbrush, Presentation, QrCode, Repeat, SearchX, Share2, Shirt, Smartphone, Star, Store, Tag, ThumbsUp, Trees,
  TriangleAlert, Trophy, UtensilsCrossed, WifiOff,
} from "lucide-react";
