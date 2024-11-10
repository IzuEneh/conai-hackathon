import {
	Image,
	StyleSheet,
	Platform,
	View,
	FlatList,
	Text,
	SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";

export default function HomeScreen() {
	const [transactions, setTransactions] = useState<any[]>([]);
	useEffect(() => {
		const getTransactions = async () => {
			const resp = await fetch(
				"https://api.firstplaidypusbank.plaid.com/fdx/v5/accounts/deposit_01_checking/transactions?startTime=2022-01-30&endTime=2022-05-30",
				{
					headers: {
						Authorization: "Bearer 000000000001",
					},
				}
			);

			if (!resp.ok) {
				throw new Error(`Failed to fetch transaction: ${resp.status}`);
			}

			const json = await resp.json();
			setTransactions(json.transactions);
			console.log("complete");
		};

		getTransactions();
	}, []);

	return (
		<SafeAreaView>
			{/* <Text style={{ color: "white" }}>Fetching TRansactions</Text> */}
			<FlatList
				data={transactions}
				renderItem={({ item }) => (
					<View>
						<Text style={{ color: "white" }}>
							{item.depositTransaction.description}
						</Text>
						<Text style={{ color: "white" }}>
							{item.depositTransaction.amount}
						</Text>
					</View>
				)}
				ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: "absolute",
	},
});
