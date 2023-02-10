/* Copyright 2004-2010 OpenERP SA
 * Copyright 2017 RGB Consulting S.L. (https://www.rgbconsulting.com)
 * License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl). */

odoo.define("pos_loyalty.loyalty_program", function (require) {
    "use strict";
    const Registries = require("point_of_sale.Registries");
    var OrderWidget = require('point_of_sale.OrderWidget');
    const { posbus } = require('point_of_sale.utils');

    const LoyaltyPointsOrderWidget = (OrderWidget) =>
        class extends OrderWidget {
            _updateSummary() {
                super._updateSummary(...arguments);
                posbus.trigger('update-loyalty-points');
            }
        };
    Registries.Component.extend(OrderWidget, LoyaltyPointsOrderWidget);

});
