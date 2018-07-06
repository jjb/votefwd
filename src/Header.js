// src/Header.js

import React, { Component } from 'react';
import { Login } from './Login';
import { Masthead } from './Masthead';
class Navbar extends Component {
  render() {
    return (
      <nav className="navbar">
        <a className="logo" href="/">
            <svg viewBox="0 0 2000 630" alt="Vote Forward">
              <g fill="none" fillRule="evenodd">
                <g fill="#FFF">
                  <path d="M882.407 288.88h-36.211L787.856 2.415h43.453l32.59 199.963h.805L897.696 2.414h43.453l-58.742 286.467zm80.87-218.873c0-11.534 2.012-21.726 6.035-30.578 4.024-8.851 9.321-16.16 15.893-21.927 6.571-5.767 13.948-10.126 22.129-13.076 8.18-2.95 16.428-4.426 24.744-4.426 8.315 0 16.563 1.475 24.744 4.426 8.18 2.95 15.557 7.309 22.128 13.076 6.572 5.767 11.87 13.076 15.893 21.927 4.023 8.852 6.035 19.044 6.035 30.578v151.28c0 11.803-2.012 22.062-6.035 30.78-4.024 8.717-9.321 15.96-15.893 21.726-6.571 5.767-13.948 10.126-22.128 13.076-8.181 2.95-16.43 4.426-24.744 4.426-8.316 0-16.563-1.475-24.744-4.426-8.181-2.95-15.558-7.31-22.13-13.076-6.57-5.767-11.868-13.009-15.892-21.726-4.023-8.718-6.035-18.977-6.035-30.78V70.007zm41.039 151.28c0 9.925 2.75 17.234 8.248 21.928 5.499 4.694 12.003 7.041 19.514 7.041 7.51 0 14.014-2.347 19.513-7.04 5.499-4.695 8.248-12.004 8.248-21.929V70.007c0-9.924-2.75-17.233-8.248-21.927-5.499-4.694-12.003-7.041-19.513-7.041-7.51 0-14.015 2.347-19.514 7.04-5.499 4.695-8.248 12.004-8.248 21.928v151.28zm159.73-180.248h-47.477V2.414h135.991v38.625h-47.476V288.88h-41.039V41.039zm106.62-38.625h122.311v38.625h-81.273v84.089h70.812v38.625h-70.812v84.089h81.273v41.039h-122.311V2.414zM801.756 340.38h122.311v38.625h-81.273v86.906h70.812v38.624h-70.812v122.312h-41.038V340.38zm146.452 67.594c0-11.534 2.011-21.727 6.035-30.578 4.023-8.852 9.32-16.16 15.892-21.928 6.572-5.767 13.948-10.125 22.13-13.076 8.18-2.95 16.428-4.426 24.743-4.426 8.315 0 16.563 1.476 24.744 4.426 8.181 2.95 15.557 7.31 22.129 13.076 6.571 5.767 11.869 13.076 15.892 21.928 4.024 8.851 6.035 19.044 6.035 30.578v151.28c0 11.802-2.011 22.061-6.035 30.779-4.023 8.717-9.32 15.96-15.892 21.726-6.572 5.767-13.948 10.126-22.129 13.076-8.181 2.95-16.429 4.426-24.744 4.426-8.315 0-16.563-1.475-24.744-4.426-8.18-2.95-15.557-7.309-22.129-13.076-6.571-5.767-11.869-13.009-15.892-21.726-4.024-8.718-6.035-18.977-6.035-30.78v-151.28zm41.039 151.28c0 9.924 2.749 17.233 8.248 21.927 5.498 4.694 12.003 7.041 19.513 7.041 7.51 0 14.015-2.347 19.514-7.04 5.498-4.695 8.248-12.004 8.248-21.928v-151.28c0-9.925-2.75-17.234-8.248-21.928-5.5-4.694-12.004-7.04-19.514-7.04s-14.015 2.346-19.513 7.04c-5.5 4.694-8.248 12.003-8.248 21.928v151.28zm173.81-90.93h23.337c7.242 0 13.009-1.005 17.3-3.017 4.292-2.011 7.578-4.895 9.858-8.65 2.28-3.755 3.822-8.382 4.626-13.88.805-5.5 1.208-11.87 1.208-19.112 0-7.242-.403-13.613-1.208-19.111-.804-5.499-2.48-10.193-5.029-14.082-2.548-3.89-6.102-6.773-10.662-8.65-4.56-1.878-10.595-2.817-18.105-2.817h-21.324v89.32zM1122.02 340.38h65.984c48.281 0 72.421 28.03 72.421 84.09 0 16.63-2.615 30.913-7.845 42.849-5.23 11.936-14.418 21.525-27.56 28.767l44.257 130.761h-43.453l-38.222-122.312h-24.543v122.312h-41.039V340.38zm341.587 286.467h-38.624l-31.383-185.881h-.805l-30.98 185.881h-38.625l-42.648-286.467h43.453l20.52 181.858h.804l32.187-181.858h31.383l33.394 186.284h.805l19.715-186.284h43.453l-42.649 286.467zM1594.77 422.86h-.805l-20.117 103.804h41.039L1594.77 422.86zm-17.301-82.48h34.199l63.972 286.467h-41.039l-12.07-61.558h-55.925l-12.07 61.558h-41.04l63.973-286.467zm159.327 127.945h23.336c7.242 0 13.009-1.006 17.3-3.018 4.292-2.011 7.578-4.895 9.858-8.65 2.28-3.755 3.822-8.382 4.627-13.88.804-5.5 1.207-11.87 1.207-19.112 0-7.242-.403-13.613-1.207-19.111-.805-5.499-2.481-10.193-5.03-14.082-2.548-3.89-6.102-6.773-10.662-8.65-4.56-1.878-10.595-2.817-18.105-2.817h-21.324v89.32zm-41.039-127.945h65.984c48.281 0 72.421 28.03 72.421 84.09 0 16.63-2.615 30.913-7.845 42.849-5.23 11.936-14.417 21.525-27.56 28.767l44.257 130.761h-43.453l-38.222-122.312h-24.543v122.312h-41.039V340.38zm171.397 0h60.754c23.336 0 41.173 6.505 53.511 19.514 12.339 13.009 18.508 31.181 18.508 54.517v133.98c0 26.822-6.505 46.604-19.514 59.345-13.009 12.74-31.717 19.111-56.126 19.111h-57.133V340.38zm41.04 247.842h18.91c11.533 0 19.714-2.883 24.542-8.65 4.828-5.767 7.242-14.82 7.242-27.158V414.411c0-11.265-2.28-19.983-6.84-26.152-4.56-6.17-12.875-9.254-24.945-9.254h-18.91v209.217z"/>
                </g>
                <path d="M557.299 629.115h-34.94c0-9.652-7.822-17.476-17.47-17.476-9.65 0-17.47 7.824-17.47 17.476h-34.941c0-9.652-7.822-17.476-17.47-17.476-9.649 0-17.47 7.824-17.47 17.476h-34.94c0-9.652-7.823-17.476-17.471-17.476-9.649 0-17.47 7.824-17.47 17.476h-34.94c0-9.652-7.822-17.476-17.47-17.476-9.65 0-17.471 7.824-17.471 17.476h-87.35v-87.377c9.648 0 17.47-7.824 17.47-17.476 0-9.651-7.822-17.475-17.47-17.475v-34.95c9.648 0 17.47-7.825 17.47-17.476 0-9.652-7.822-17.476-17.47-17.476v-34.95c9.648 0 17.47-7.825 17.47-17.476s-7.822-17.475-17.47-17.475v-34.951c9.648 0 17.47-7.824 17.47-17.476 0-9.651-7.822-17.475-17.47-17.475v-34.95c9.648 0 17.47-7.825 17.47-17.476 0-9.652-7.822-17.476-17.47-17.476v-34.95c9.648 0 17.47-7.824 17.47-17.476 0-9.651-7.822-17.475-17.47-17.475v-34.951c9.648 0 17.47-7.824 17.47-17.476 0-9.65-7.822-17.475-17.47-17.475V0h87.35c0 9.651 7.822 17.475 17.47 17.475 9.649 0 17.47-7.824 17.47-17.475h34.94c0 9.651 7.822 17.475 17.47 17.475 9.65 0 17.471-7.824 17.471-17.475h34.94c0 9.651 7.822 17.475 17.47 17.475 9.65 0 17.47-7.824 17.47-17.475h34.941c0 9.651 7.822 17.475 17.47 17.475 9.649 0 17.47-7.824 17.47-17.475H557.3c0 9.651 7.822 17.475 17.47 17.475 9.649 0 17.47-7.824 17.47-17.475h87.351v87.377c-9.648 0-17.47 7.824-17.47 17.475 0 9.652 7.822 17.476 17.47 17.476v34.95c-9.648 0-17.47 7.825-17.47 17.476 0 9.652 7.822 17.476 17.47 17.476v34.95c-9.648 0-17.47 7.824-17.47 17.476 0 9.651 7.822 17.475 17.47 17.475v34.951c-9.648 0-17.47 7.824-17.47 17.475 0 9.652 7.822 17.476 17.47 17.476v34.95c-9.648 0-17.47 7.825-17.47 17.476s7.822 17.475 17.47 17.475v34.951c-9.648 0-17.47 7.824-17.47 17.476 0 9.651 7.822 17.475 17.47 17.475v34.951c-9.648 0-17.47 7.824-17.47 17.475 0 9.652 7.822 17.476 17.47 17.476v87.377h-87.35c0-9.652-7.822-17.476-17.47-17.476-9.65 0-17.471 7.824-17.471 17.476zm-312.134-57.669V59.999H624.85v511.447H245.165zM636.497 48.349H233.518v534.747h402.98V48.35z" fill="#FFF"/>
                <path d="M0 441.03v-37.012a168.07 168.07 0 0 1 7.733-3.979c34.32-12.826 68.412-13.169 101.645-.97a147.791 147.791 0 0 1 12.659 7.007c10.2 6.297 20.545 11.365 31.018 15.207 34.056 16.663 69.312 16.124 107.123-1.86 9.187-3.476 18.42-7.782 27.69-12.917l-.165-.323c3.88-2.247 7.74-4.295 11.579-6.144 34.32-12.826 68.412-13.169 101.645-.97a147.791 147.791 0 0 1 12.66 7.007c10.199 6.297 20.544 11.365 31.017 15.207 34.057 16.663 69.312 16.124 107.123-1.86a195.81 195.81 0 0 0 7.319-2.94v37.151c-21.95 11.638-43.024 17.496-63.482 17.618l-.783.002c-21.438-.026-42.202-6.358-62.589-18.944-26.2-16.175-53.083-24.25-80.322-24.254h-.44c-27.006.082-54.361 8.094-81.747 24.006l.164.305c-22.797 12.48-44.645 18.758-65.833 18.885l-.782.002c-21.438-.026-42.202-6.358-62.59-18.944-26.2-16.175-53.083-24.25-80.321-24.254h-.44c-19.814.06-39.817 4.39-59.881 12.975zm0-68.675V335.34a168.072 168.072 0 0 1 7.733-3.978c34.32-12.826 68.412-13.17 101.645-.97a147.79 147.79 0 0 1 12.659 7.006c10.2 6.297 20.545 11.365 31.018 15.208 34.056 16.663 69.312 16.123 107.123-1.86 9.187-3.476 18.42-7.783 27.69-12.917l-.165-.323c3.88-2.247 7.74-4.295 11.579-6.144 34.32-12.826 68.412-13.17 101.645-.97a147.79 147.79 0 0 1 12.66 7.006c10.199 6.297 20.544 11.365 31.017 15.208 34.057 16.663 69.312 16.123 107.123-1.86a195.81 195.81 0 0 0 7.319-2.94v37.15c-21.95 11.64-43.024 17.496-63.482 17.618-.261.002-.522.002-.783.002-21.438-.025-42.202-6.357-62.589-18.943-26.2-16.175-53.083-24.25-80.322-24.254h-.44c-27.006.082-54.361 8.094-81.747 24.006l.164.305c-22.797 12.48-44.645 18.758-65.833 18.884-.26.002-.521.002-.782.002-21.438-.025-42.202-6.357-62.59-18.943-26.2-16.175-53.083-24.25-80.321-24.254h-.44c-19.814.06-39.817 4.389-59.881 12.975zm0-106.569c47.798-20.454 95.244-16.748 140.643 11.279 40.768 25.169 83.042 25.329 129.204.058l-.164-.306c55.159-32.05 110.194-32.05 162.51.248 40.075 24.74 81.604 25.316 126.853 1.324v37.893c-21.95 11.638-43.024 17.495-63.482 17.617-.261.002-.522.002-.783.002-21.438-.025-42.202-6.357-62.589-18.944-26.2-16.175-53.083-24.249-80.322-24.254l-.44.001c-27.006.081-54.361 8.093-81.747 24.005l.164.306c-22.797 12.48-44.645 18.758-65.833 18.884-.26.002-.521.002-.782.002-21.438-.025-42.202-6.357-62.59-18.944-26.2-16.175-53.083-24.249-80.321-24.254l-.44.001c-19.814.06-39.817 4.389-59.881 12.974v-37.892z" fill="#FF4B4B" fillRule="nonzero"/>
              </g>
            </svg>
        </a>
        <Login auth={this.props.auth} />
      </nav>
    );
  }
}
export class Header extends Component {
  render() {
    return (
      <React.Fragment>
        { this.props.auth.isAuthenticated() ?
          (
            <Navbar />
          ) :
          (
            <Masthead />
          )
        }
      </React.Fragment>
    );
  }
}
