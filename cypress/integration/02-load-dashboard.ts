/*
 *     Copyright (C) 2024  Intergral GmbH
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { e2e } from '@grafana/e2e';

e2e.scenario({
  describeName: 'can load dashboard',
  itName: 'load dashboard',
  scenario: () => {
    e2e.flows.openDashboard({ uid: 'b5637cf4-753f-4f80-bbfe-835716e66b86' });

    // change frame
    e2e().get('span:contains("o.a.j.c.print_005fpause_005frepeat_jsp")').should('be.visible').click();
    e2e().get('div:contains("com.intergral.fusionreactor.j2ee.core.FusionRequest")').should('be.visible');

    // expand attributes
    e2e().get('span:contains("Snapshot Attributes")').should('be.visible').click();
    e2e().get('span:contains("No watches configured")').should('be.visible');
    e2e().get('div:contains("com.intergral.fusionreactor.j2ee.core.FusionRequest")').should('be.visible');
  },
});
