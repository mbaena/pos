odoo.define('pos_loyalty.LoyaltyPoints', function (require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require("point_of_sale.Registries");
    const { posbus } = require('point_of_sale.utils');

    class LoyaltyPoints extends PosComponent {
        constructor() {
            super(...arguments);
            posbus.on("update-loyalty-points", null,  () => { this.onUpdateSummary() });
            this.points_won = 0;
            this.points_spent = 0;
            this.points_total = 0;
            this.negative = true;
            this.hidden = true;
            this.rounding = this.env.pos.loyalty.rounding;
            this.onUpdateSummary();
        }

        onUpdateSummary() {
            var order = this.env.pos.get_order();
            this.hidden = this.env.pos.loyalty && order.get_client() == null;
            if (this.hidden) {
                return
            }
            this.points_won = order.get_won_points();
            this.points_spent = order.get_spent_points();
            this.points_total = order.get_new_total_points();
            this.negative = this.points_total < 0;
        }
    }

    LoyaltyPoints.template = 'LoyaltyPoints';
    Registries.Component.add(LoyaltyPoints);
    return LoyaltyPoints;
});
