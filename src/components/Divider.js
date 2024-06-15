export function Divider() {
	return (
		<div className="relative">
			<div className="absolute inset-0 flex items-center" aria-hidden="true">
				<div className="ml-20 w-full border-t border-gray-800"></div>
			</div>
			<div className="relative flex justify-start">
				<span className="bg-grey-200 pr-3 text-md font-medium text-gray-700">
					Report:
				</span>
			</div>
		</div>
	);
}
