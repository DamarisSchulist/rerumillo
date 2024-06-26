import { formatAbi } from 'abitype'

/**
 * Creates read action creators from parameters
 * @internal
 * @param {object} params
 * @param {import('abitype').Abi} params.methods
 * @param {import('viem').Hex} [params.bytecode]
 * @param {import('viem').Hex} [params.deployedBytecode]
 * @param {import('abitype').Address} [params.address]
 * @returns {import('./ReadActionCreator.js').ReadActionCreator<any, any, any, any>} A mapping of method names to action creators
 */
export const readFactory = ({ methods, bytecode, deployedBytecode, address }) =>
	Object.fromEntries(
		methods
			.filter(({ type }) => type === 'function')
			.map((method) => {
				/**
				 * @param {...any} args
				 */
				const creator = (...args) => {
					// need to handle case where there is an overload
					// TODO make this more efficient
					const methodAbi = methods.filter(
						(m) =>
							/**@type {import('abitype').AbiFunction}*/ (m).name ===
							/**@type {import('abitype').AbiFunction}*/ (method)?.name,
					)
					const maybeArgs = args.length > 0 ? { args } : {}
					return {
						abi: methodAbi,
						humanReadableAbi: formatAbi([method]),
						functionName: /**@type {import('abitype').AbiFunction}*/ (method)
							.name,
						bytecode,
						deployedBytecode,
						address,
						to: address,
						...maybeArgs,
					}
				}
				creator.abi = [method]
				creator.humanReadableAbi = formatAbi([method])
				creator.bytecode = bytecode
				creator.deployedBytecode = deployedBytecode
				creator.address = address
				creator.to = address
				return [
					/**@type {import('abitype').AbiFunction}*/ (method).name,
					creator,
				]
			}),
	)
