import { AiOutlineClose, AiOutlineWarning } from "react-icons/ai";
import { BsChevronLeft } from "react-icons/bs";
import { BsGrid, BsTable } from "react-icons/bs";
import { FaLink, FaRegFileAlt } from "react-icons/fa";
import { FiCalendar, FiClock, FiHome } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  LuLogIn,
  LuLogOut,
  LuPlus,
  LuSettings,
  LuTrash2,
} from "react-icons/lu";
import {
  MdAdd,
  MdArrowForward,
  MdBlock,
  MdCheck,
  MdChevronRight,
  MdCircle,
  MdEdit,
  MdOutlineInfo,
  MdRefresh,
  MdRemove,
} from "react-icons/md";

export const iconFileNames = {
  about: { icon: MdOutlineInfo },
  arrow: { icon: MdArrowForward },
  calendar: { icon: FiCalendar },
  check: { icon: MdCheck },
  chevron: { icon: MdChevronRight },
  chevronLeft: { icon: BsChevronLeft },
  clock: { icon: FiClock },
  close: { icon: AiOutlineClose },
  core: { icon: MdCircle },
  hamburger: { icon: GiHamburgerMenu },
  home: { icon: FiHome },
  info: { icon: MdOutlineInfo },
  link: { icon: FaLink },
  none: { icon: MdBlock },
  refresh: { icon: MdRefresh },
  remove: { icon: MdRemove },
  resume: { icon: FaRegFileAlt },
  settings: { icon: LuSettings },
  warning: { icon: AiOutlineWarning },
  plus: { icon: LuPlus },
  add: { icon: MdAdd },
  edit: { icon: MdEdit },
  delete: { icon: LuTrash2 },
  grid: { icon: BsGrid },
  table: { icon: BsTable },
  login: { icon: LuLogIn },
  logout: { icon: LuLogOut },
};

export type IconsLisType = keyof typeof iconFileNames;

export const mapIconData = {} as Record<IconsLisType, IconsLisType>;

(Object.keys(iconFileNames) as IconsLisType[]).forEach((key) => {
  mapIconData[key] = key;
});
