import React, { useState } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Currency from './Currency';
import Box from './Box';
import Table from './Table';
import TableRow from './TableRow';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function TokenBalances(props, context) {
	const { t } = useTranslation();

	const noBalanceYet = balances => {
		for (var addr in balances) {
			if (balances.hasOwnProperty(addr)) {
				if (balances[addr] > 0) {
					return false;
				}
			}
		}
		return true;
	};

	const buildGovernanceTokenBalance = (contract, name, symbol) => {
		let balance = props.usersFin4GovernanceTokenBalances[contract.address];
		if (balance === 0) {
			return;
		}
		return (
			<TableRow
				key={'balance_' + name}
				data={{
					name: (
						<>
							<span>
								<Currency symbol={symbol} name={name} />
							</span>
							<FontAwesomeIcon icon={faInfoCircle} style={styles.infoIcon} />
						</>
					),
					balance: balance
				}}
			/>
		);
	};

	return (
		<Box title={t('your-token-balances')}>
			{noBalanceYet(props.usersFin4TokenBalances) && noBalanceYet(props.usersFin4GovernanceTokenBalances) ? (
				<NoTokens>{t('no-tokens-yet')}</NoTokens>
			) : (
				<Table headers={[t('token-name'), t('token-balance')]} colWidths={[85, 15]}>
					{props.contracts.GOV &&
						props.contracts.GOV.initialized &&
						buildGovernanceTokenBalance(context.drizzle.contracts.GOV, 'Fin4 Governance Token', 'GOV')}
					{props.contracts.Fin4Reputation &&
						props.contracts.Fin4Reputation.initialized &&
						buildGovernanceTokenBalance(context.drizzle.contracts.Fin4Reputation, 'Fin4 Reputation Token', 'REP')}
					{Object.keys(props.usersFin4TokenBalances).map((tokenAddr, index) => {
						let token = props.fin4Tokens[tokenAddr];
						return (
							<TableRow
								key={'balance_' + index}
								data={{
									name: (
										<span title={'Description: ' + token.description + '\nUnit:' + token.unit}>
											<Currency symbol={token.symbol} name={token.name} linkTo={'/token/view/' + token.symbol} />
										</span>
									),
									balance: props.usersFin4TokenBalances[tokenAddr]
								}}
							/>
						);
					})}
				</Table>
			)}
		</Box>
	);
}

const styles = {
	infoIcon: {
		color: 'silver',
		width: '16px',
		height: '16px',
		paddingLeft: '5px'
	}
};

const NoTokens = styled.div`
	font-family: arial;
	text-align: center;
	color: silver;
`;

TokenBalances.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		usersFin4TokenBalances: state.fin4Store.usersFin4TokenBalances,
		usersFin4GovernanceTokenBalances: state.fin4Store.usersFin4GovernanceTokenBalances,
		fin4Tokens: state.fin4Store.fin4Tokens,
		contracts: state.contracts
	};
};

export default drizzleConnect(TokenBalances, mapStateToProps);