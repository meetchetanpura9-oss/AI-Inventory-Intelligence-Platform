from sklearn.ensemble import GradientBoostingRegressor

class SalesForecastModel:
    def __init__(self, n_estimators=100, random_state=42):
        self.model = GradientBoostingRegressor(n_estimators=n_estimators, random_state=random_state)

    def fit(self, X, y):
        self.model.fit(X, y)
        return self

    def predict(self, X):
        return self.model.predict(X)
