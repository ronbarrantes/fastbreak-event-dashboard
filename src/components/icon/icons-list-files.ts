// eslint-disable-next-line simple-import-sort/imports
import { AiOutlineClose, AiOutlineWarning } from "react-icons/ai";
import { BsChevronLeft } from "react-icons/bs";
import { FaLink, FaRegFileAlt } from "react-icons/fa";
import { FiCalendar, FiClock, FiHome } from "react-icons/fi";
import { BsGrid, BsTable } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  LuSettings,
  LuPlus,
  LuTrash2,
  LuLogIn,
  LuLogOut,
} from "react-icons/lu";
import {
  MdBlock,
  MdEdit,
  MdCheck,
  MdChevronRight,
  MdCircle,
  MdOutlineInfo,
  MdRefresh,
  MdRemove,
  MdAdd,
} from "react-icons/md";

export const iconFileNames = {
  about: { icon: MdOutlineInfo },
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
