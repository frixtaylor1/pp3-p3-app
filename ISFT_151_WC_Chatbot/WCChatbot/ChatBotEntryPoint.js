/**
 * @file ChatBotEntryPoint.js
 * @description Entry point for Web Component of ChatBot
 * @license GPL-3.0
 *
 * WCChatBot - Web Component for Chat Bot
 * Copyright (c) 2023 Omar Lopez, 
 *                    Evelyn Flores, 
 *                    Karen Manchado, 
 *                    Facundo Caminos, 
 *                    Ignacio Moreno,
 *                    Kevin Taylor,
 *                    Matias Cardenas
 *                    ISFT N° 151
 *
 *  Project Supervisor: Prof. Matias Santiago Gastón
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * Year: 2023
 */

import { ChatBotController }  from "./ChatBotController.js";
import { ChatBotView }        from "./ChatBotView.js";
import { ChatBotModel }       from "./ChatBotModel.js";

function WebComponentEntryPoint()
{
  let chatBotView = new ChatBotView();
  new ChatBotController(chatBotView, new ChatBotModel());

  document.body.appendChild(chatBotView);
}

window.onload = WebComponentEntryPoint;