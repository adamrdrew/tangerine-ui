import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import ChatBubble from '@material-ui/icons/ChatBubble';
import { Settings } from '@material-ui/icons';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarScrollWrapper,
  SidebarSpace,
  useSidebarOpenState,
  Link,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();
  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />

      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarItem icon={ChatBubble} to="convo" text="Chat" />
        <SidebarDivider />
        <SidebarItem
          icon={Settings}
          to="assistant-admin"
          text="Assistant Admin"
        />

        <SidebarDivider />
        <SidebarScrollWrapper></SidebarScrollWrapper>
      </SidebarGroup>
      <SidebarSpace />
      <SidebarDivider />
    </Sidebar>
    {children}
  </SidebarPage>
);
