(function () {

    const _programmers = Symbol('programmers');
    
//Przygotowanie listy z danymi wejściowymi
    fetch('https://files.gwo.pl/custom/random-data.json')
            .then(response => response.json())
            .then(myJson => {
                recruitmentAgency = new RecruitmentAgency(myJson);
            })
            .catch(err => {
                console.error(`Wystapil blad: ${err}`);
            });

    function makeProgrammersList(programmers) {
        let programmerslist = new Map;
        for (let programmer of programmers) {
            programmerslist.set(programmerslist.size + 1, new Programmer(programmer));
        }
        return programmerslist;
    }

//Programmer
    class Programmer {
        constructor( {name, framework, experience, available}) {
            this.name = name;
            this.framework = framework;
            this.experience = experience;
            this.available = available;
        }

    }

    class RecruitmentAgency {
        constructor(programmers = {}) {
            this[_programmers] = makeProgrammersList(programmers);
        }

//dodaje programistę z kolejnym kluczem
        addProgrammer(obj) {
            let keys = this[_programmers].keys();
            let new_key = Math.max(...[...keys]) + 1;
            let newProgrammer = new Programmer(obj);
            let {name, framework, experience, available} = newProgrammer;

            this[_programmers].set(new_key, newProgrammer);

            return `Dodano nowego programistę, klucz: ${new_key}, name: ${name}, framework: ${framework}, experience: ${experience}, available: ${available}`;
        }

//aktualizacja programisty
        updateProgrammer(key, obj) {
            let programmer = this[_programmers].get(key);
            let zmiany = "";

            for (let key in programmer) {
                if (obj[key]) {
                    programmer[key] = obj[key];
                    zmiany += `${key}: ${obj[key]}`;
                }
            }

            return zmiany ? `Wprowadzono zmiany dla programisty: klucz: ${key}, ` + zmiany : `Zmiany nie zostały wprowadzone`;
        }

//usuwanie programisty po kluczu lub po obiekcie
        deleteProgrammer(value) {
            if (typeof value === 'number') {
                this[_programmers].delete(value);
                return `Usunięto programistę klucz: ${value}`;
            }
            if (typeof value === 'object') {
                for (let programmer of this[_programmers]) {
                    if (Object.is(programmer[1], value)) {
                        this[_programmers].delete(programmer[0]);
                        return `Usunięto programistę klucz: ${programmer[0]}`;
                    }
                }
            }
        }

//pobiera programistę na podstawie klucza
        getProgrammer(key) {
            return this[_programmers].get(key);
        }

//pobiera listę programistów w formie obiektu Map
        getAllProgramers() {
            return this[_programmers];
            //return [...this[_programmers]];
        }

//obiekt zawiera field i value
        getFilteredProgrammers(obj) {
            return [...this[_programmers]].filter(value => value[1][obj.field] === obj.value);
        }

//zwraca tekst z listą dostępnych programistów
        getShowcase() {
            let availableProgrammers = [...this[_programmers].values()].filter(value => value.available);
            let text = 'Lista dostêpnych programistów:';
            for (let programmer of availableProgrammers) {
                text += "\n" + programmer.name;
            }
            return text;
        }
    }
})();

