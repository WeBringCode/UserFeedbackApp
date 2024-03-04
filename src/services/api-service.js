// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import caller from './http-service';

class ApiService {
	constructor(apiKey, fingerprint) {
		this.apiKey = apiKey;
		this.fingerprint = fingerprint || null;
	}

	/**
	 * Send a POST request to the API to create a new impression
	 *
	 * @param {object} context
	 * @param {object} config
	 *
	 * @returns {object} response
	 */
	async postImpression(context, config) {
		const impressionData = {
			fingerprint: this.fingerprint,
			domain: context.domain,
			path: context.path,
			name: context.name,
		};

		if (config.hasOwnProperty('tags') && config.tags) {
			impressionData.tags = context.tags;
		}

		if (config.hasOwnProperty('labels') && config.labels) {
			impressionData.labels = context.labels;
		}

		// Verify if the context has an htmlId property
		if (config.hasOwnProperty('parentId') && config.parentId) {
			impressionData.parentId = context.parentId;
		}

		try {
			const response = await caller(
				'POST',
				'/impression/create',
				impressionData,
				{
					'X-API-KEY': this.apiKey,
				}
			);
			return response;
		} catch (error) {
			console.error('Error posting impression:', error);
		}
	}

	/**
	 * Send a POST request to the API to create a new rating
	 *
	 * @param {string} impressionId
	 * @param {number} score
	 *
	 * @returns {object} response
	 */
	async postRating(impressionId, score) {
		const ratingData = {
			fingerprint: this.fingerprint,
			impressionId: impressionId,
			score,
		};

		try {
			const response = await caller(
				'POST',
				'/rating/create',
				ratingData,
				{
					'X-API-KEY': this.apiKey,
				}
			);
			return response;
		} catch (error) {
			console.error('Error posting rating:', error);
		}
	}
}

export default ApiService;
