import { BrowserRouter, Redirect, Route, Switch, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Store } from "../types/storeTypes";
import { storeApi } from "../api/storeApi";
import Menu from "../components/Menu/Menu";
import TablePage from "./TablePage";
import { Container } from "../components/Container";
import { categoryUpsertFields, Model, productUpsertFields } from "../utils/modelHelpers";
import { connect, ConnectedProps } from "react-redux";
import { AppState } from "../redux/store";
import { setStore } from "../redux/actions";
import UpsertPage from "./UpsertPage";
import { categoryApi } from "../api/categoryApi";
import { productApi } from "../api/productApi";
import { Product } from "types/productTypes";
import { Category } from "types/categoryTypes";

function StoreMain({ store, setStore }: ReduxProps) {
	const [loading, setLoading] = useState(true);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		const storeId = Number(id);
		storeApi
			.get(storeId)
			.then((store) => setStore(store))
			.finally(() => setLoading(false));
	}, []);

	return (
		<>
			<Menu />
			<Container>
				<Switch>
					<Route
						exact
						path={"/store/" + store?.id + "/categories"}
						render={() => <TablePage model={Model.category} />}
					/>
					<Route
						exact
						path={"/store/" + store?.id + "/products"}
						render={() => <TablePage model={Model.product} />}
					/>
					<Route
						path={"*product-upsert/:id?"}
						render={() => (
							<UpsertPage
								dataFetcher={(id: number) => productApi.get(id)}
								fields={productUpsertFields as never}
								submit={(values) => productApi.post(values as Product)}
							/>
						)}
					/>
					<Route
						path={"*category-upsert/:id?"}
						render={() => (
							<UpsertPage
								dataFetcher={(id: number) => categoryApi.get(id)}
								fields={categoryUpsertFields as never}
								submit={(values) => categoryApi.post(values as Category)}
							/>
						)}
					/>
					<Route path={"/store/" + store?.id}>
						<Redirect to={"/store/" + store?.id + "/products"} />
					</Route>
				</Switch>
			</Container>
		</>
	);
}

const connector = connect(
	(state: AppState) => ({ store: state.store }),
	(dispatch) => ({
		setStore: (store: Store) => dispatch(setStore(store)),
	})
);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(StoreMain);
