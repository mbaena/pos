odoo.define('pos_loyalty.LoyaltyButton', function (require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const {useListener} = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');

    class LoyaltyButton extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click', this.onClick);
        }
        mounted() {
            this.env.pos.get('orders').on('add remove change', () => this.render(), this);
            this.env.pos.on('change:selectedOrder', () => this.render(), this);
        }
        willUnmount() {
            this.env.pos.get('orders').off('add remove change', null, this);
            this.env.pos.off('change:selectedOrder', null, this);
        }
        get currentOrder() {
            return this.env.pos.get_order();
        }

        async onClick() {

            var client = this.currentOrder.get_client();
            if (!client) {
                this.trigger('click-customer');
                return;
            }

            var rewards = this.currentOrder.get_available_rewards();
            if (rewards.length === 0) {

                const {confirmed, payload: selectedReward} = await this.showPopup(
                    'ErrorPopup',
                    {
                        title: this.env._t("No Rewards Available"),
                        body: this.env._t(
                            "There are no rewards available for this customer as part of the loyalty program"
                        ),
                    }
                );

            } else if (rewards.length === 1 && this.env.pos.loyalty.rewards.length === 1) {
                this.currentOrder.apply_reward(rewards[0]);
            } else {
                const selectionList = rewards.map(reward => ({
                    id: reward.id,
                    label: reward.name,
                    //isSelected: reward.id === this.currentOrder.pricelist.id,
                    item: reward,
                }));

                const {confirmed, payload: selectedReward} = await this.showPopup(
                    'SelectionPopup',
                    {
                        title: this.env._t("Please select a reward"),
                        list: selectionList,
                    }
                );

                if (confirmed) {
                    this.currentOrder.apply_reward(selectedReward);
                }

            }

        }
    }

    LoyaltyButton.template = 'LoyaltyButton';

    ProductScreen.addControlButton({
        component: LoyaltyButton,
        condition: function () {
            return this.env.pos.loyalty && this.env.pos.loyalty.rewards.length;
        },
    });

    Registries.Component.add(LoyaltyButton);

    return LoyaltyButton;
});



